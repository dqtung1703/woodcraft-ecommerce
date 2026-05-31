<?php

// =============================================
// app/Services/OrderService.php
// =============================================
namespace App\Services;

use App\DTOs\Order\PlaceOrderDTO;
use App\Events\Order\OrderPlaced;
use App\Events\Order\OrderStatusChanged;
use App\Exceptions\CartException;
use App\Exceptions\OrderException;
use App\Exceptions\ProductException;
use App\Exceptions\VoucherException;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Voucher;
use App\Models\VoucherUsage;
use App\Repositories\Contracts\OrderRepositoryInterface;
use App\Repositories\Contracts\ProductRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

final class OrderService
{
    // Định nghĩa các transition hợp lệ
    private const STATUS_TRANSITIONS = [
        'pending'    => ['confirmed', 'cancelled'],
        'processing' => ['confirmed', 'cancelled'], // Online payment thành công, chờ admin xác nhận
        'confirmed'  => ['shipping', 'cancelled'],
        'shipping'   => ['delivered'],
        'delivered'  => [],
        'cancelled'  => [],
    ];

    public function __construct(
        private readonly OrderRepositoryInterface   $orderRepository,
        private readonly ProductRepositoryInterface $productRepository,
    ) {}

    public function getUserOrders(int $userId): LengthAwarePaginator
    {
        return $this->orderRepository->paginateByUser($userId);
    }

    public function getUserOrder(int $orderId, int $userId): Order
    {
        $order = $this->orderRepository->findByIdAndUser(
            $orderId,
            $userId,
            ['items.product.images', 'payment', 'voucher']
        );

        if (!$order) {
            throw OrderException::notFound($orderId);
        }

        return $order;
    }

    public function getAllOrders(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->orderRepository->paginateAll($filters, $perPage);
    }

    /**
     * Admin: lấy bất kỳ đơn nào theo ID, không filter theo user
     */
    public function getOrderById(int $orderId): Order
    {
        $order = $this->orderRepository->findById(
            $orderId,
            ['items.product.images', 'payment', 'voucher', 'user']
        );

        if (!$order) {
            throw OrderException::notFound($orderId);
        }

        return $order;
    }

    /**
     * Đặt hàng — core business logic
     * Toàn bộ chạy trong 1 transaction, rollback nếu có lỗi
     */
    public function placeOrder(PlaceOrderDTO $dto): Order
    {
        return DB::transaction(function () use ($dto) {
            // 1. Lấy giỏ hàng
            $cart = Cart::with(['items.product'])
                ->where('user_id', $dto->userId)
                ->first();

            if (!$cart || $cart->items->isEmpty()) {
                throw CartException::empty();
            }

            // 2. Tính tổng tiền (dùng final_price để tính đúng giá sau discount SP)
            $totalPrice = $cart->items->sum(fn($i) => $i->quantity * $i->product->final_price);

            // 3. Xử lý voucher (Có bọc lockForUpdate ngầm định bên trong hàm applyVoucher)
            [$voucher, $discountAmount] = $this->applyVoucher(
                $dto->voucherCode,
                $dto->userId,
                $totalPrice
            );

            $finalPrice = max(0, $totalPrice - $discountAmount);

            // 4. Tạo đơn hàng (có shipping snapshot)
            $order = $this->orderRepository->create([
                'user_id'          => $dto->userId,
                'total_price'      => $totalPrice,
                'discount_amount'  => $discountAmount,
                'final_price'      => $finalPrice,
                'voucher_id'       => $voucher?->id,
                'status'           => 'pending',
                'note'             => $dto->note,
                'shipping_name'    => $dto->shippingName,
                'shipping_phone'   => $dto->shippingPhone,
                'shipping_address' => $dto->shippingAddress,
            ]);

            // 5. Tạo order items + trừ tồn kho với pessimistic lock đúng cách (Chống Deadlock)
            $productIds = $cart->items->pluck('product_id')->sort()->values();

            $lockedProducts = DB::table('products')
                ->whereIn('id', $productIds)
                ->orderBy('id')
                ->lockForUpdate()
                ->get()
                ->keyBy('id');

            // Validate
            foreach ($cart->items as $item) {
                $lockedProduct = $lockedProducts->get($item->product_id);

                if (!$lockedProduct || $lockedProduct->stock <= 0) {
                    throw ProductException::outOfStock($item->product->name);
                }

                if ($lockedProduct->stock < $item->quantity) {
                    throw ProductException::insufficientStock(
                        $item->product->name,
                        $lockedProduct->stock
                    );
                }
            }

            // Thực thi Decrement và tạo items
            foreach ($cart->items as $item) {
                DB::table('products')
                    ->where('id', $item->product_id)
                    ->decrement('stock', $item->quantity);

                OrderItem::create([
                    'order_id'   => $order->id,
                    'product_id' => $item->product_id,
                    'price'      => $item->product->final_price, // lưu giá tại thời điểm mua
                    'quantity'   => $item->quantity,
                ]);
            }

            // 6. Tạo payment record
            // Phân biệt: unpaid = COD/banking, pending = online (chờ gateway xác nhận)
            $isOnlinePayment = in_array($dto->paymentMethod, ['vnpay', 'momo']);

            Payment::create([
                'order_id'       => $order->id,
                'payment_method' => $dto->paymentMethod,
                'payment_status' => $isOnlinePayment ? 'pending' : 'unpaid',
                'amount'         => $finalPrice,
                'expired_at'     => $isOnlinePayment
                    ? now()->addMinutes(config('payment.' . $dto->paymentMethod . '.expire_minutes', 15))
                    : null,
            ]);

            // 7. Ghi lại voucher usage + tăng used_count
            if ($voucher) {
                VoucherUsage::create([
                    'voucher_id' => $voucher->id,
                    'user_id'    => $dto->userId,
                    'order_id'   => $order->id,
                    'used_at'    => now(),
                ]);
                $voucher->increment('used_count');
            }

            // 8. Xóa giỏ hàng
            // Online payment: GIỬ cart — FE sẽ clearCart() sau khi payment_status = 'paid'
            // COD/banking: Xóa luôn
            if (!$isOnlinePayment) {
                $cart->items()->delete();
            }

            // 9. Dispatch event
            event(new OrderPlaced($order));

            Log::info('Order placed successfully', [
                'order_id'       => $order->id,
                'user_id'        => $dto->userId,
                'total_price'    => $totalPrice,
                'final_price'    => $finalPrice,
                'payment_method' => $dto->paymentMethod,
                'is_online'      => $isOnlinePayment,
                'voucher'        => $voucher?->code,
            ]);

            return $order->load(['items.product', 'payment', 'voucher']);
        });
    }

    /**
     * User tự hủy đơn — điểm hủy duy nhất trong hệ thống.
     * Áp dụng cho mọi payment method khi order.status = 'pending'.
     * Fix: dùng 'cancelled' thay vì 'refunded' — chưa có giao dịch tiền thật.
     * Fix: lockForUpdate() chống race condition với IPN handler.
     */
    public function cancelOrder(int $orderId, int $userId): Order
    {
        $order = $this->orderRepository->findByIdAndUser(
            $orderId,
            $userId,
            ['items.product', 'payment', 'voucher']
        );

        if (!$order) {
            throw OrderException::notFound($orderId);
        }

        return DB::transaction(function () use ($order) {
            // lockForUpdate: chống race condition với IPN handler đang chạy song song
            $lockedOrder = Order::with(['items.product', 'payment', 'voucher'])
                ->where('id', $order->id)
                ->lockForUpdate()
                ->firstOrFail();

            // Chỉ cho user tự hủy khi status = 'pending'
            // Bao gồm: COD chờ xác nhận, online chờ thanh toán, online failed/cancelled/expired
            if ($lockedOrder->status !== 'pending') {
                throw OrderException::cannotCancel();
            }

            $payment = $lockedOrder->payment;

            // Nếu đã paid → không cho user tự hủy, phải qua admin xử lý refund
            if ($payment?->payment_status === 'paid') {
                throw new \RuntimeException(
                    'Đơn hàng đã thanh toán. Vui lòng liên hệ admin để được hỗ trợ hoàn tiền.'
                );
            }

            // Hoàn tồn kho
            foreach ($lockedOrder->items as $item) {
                $this->productRepository->incrementStock($item->product_id, $item->quantity);
            }

            // Hoàn voucher usage
            if ($lockedOrder->voucher_id) {
                $lockedVoucher = Voucher::where('id', $lockedOrder->voucher_id)->lockForUpdate()->first();
                VoucherUsage::where('order_id', $lockedOrder->id)->delete();
                if ($lockedVoucher) {
                    $lockedVoucher->decrement('used_count');
                }
            }

            $oldStatus = $lockedOrder->status;
            $updated   = $this->orderRepository->updateStatus($lockedOrder, 'cancelled');

            // Fix: dùng 'cancelled' (không phải 'refunded')
            // 'refunded' chỉ set khi admin/gateway xác nhận hoàn tiền ngân hàng thật sự
            $payment?->update(['payment_status' => 'cancelled']);

            event(new OrderStatusChanged($updated, $oldStatus, 'cancelled'));

            return $updated->refresh();
        });
    }

    /**
     * Admin cập nhật trạng thái đơn hàng
     */
    public function updateStatus(int $orderId, string $newStatus): Order
    {
        return DB::transaction(function () use ($orderId, $newStatus) {
            $order = Order::with(['items.product', 'payment', 'voucher'])
                ->where('id', $orderId)
                ->lockForUpdate()
                ->first();

            if (!$order) {
                throw OrderException::notFound($orderId);
            }

            if (!$this->canTransition($order->status, $newStatus)) {
                throw OrderException::invalidStatusTransition($order->status, $newStatus);
            }

            $payment = $order->payment;

            if (
                $newStatus === 'confirmed'
                && $payment?->isOnlineMethod()
                && ($order->status !== 'processing' || $payment->payment_status !== 'paid')
            ) {
                throw OrderException::invalidStatusTransition($order->status, $newStatus);
            }

            $oldStatus = $order->status;
            $updated = $this->orderRepository->updateStatus($order, $newStatus);

            // Cập nhật payment + tăng sold_count khi delivered
            if ($newStatus === 'delivered') {
                $updated->payment?->update(['payment_status' => 'paid', 'paid_at' => now()]);
                foreach ($order->items as $item) {
                    $this->productRepository->incrementSoldCount($item->product_id, $item->quantity);
                }
            }

            // Hoàn tồn kho khi admin hủy
            if ($newStatus === 'cancelled' && $oldStatus !== 'cancelled') {
                if ($payment && $payment->payment_status !== 'paid') {
                    $payment->update(['payment_status' => 'cancelled']);
                }

                foreach ($order->items as $item) {
                    $this->productRepository->incrementStock($item->product_id, $item->quantity);
                    // Nếu hủy sau khi đã delivered, cần giảm sold_count lại
                    if ($oldStatus === 'delivered') {
                        $this->productRepository->decrementSoldCount($item->product_id, $item->quantity);
                    }
                }
                // Hoàn voucher
                if ($order->voucher_id) {
                    $lockedVoucher = Voucher::where('id', $order->voucher_id)->lockForUpdate()->first();
                    VoucherUsage::where('order_id', $order->id)->delete();
                    if ($lockedVoucher) {
                        $lockedVoucher->decrement('used_count');
                    }
                }
            }

            event(new OrderStatusChanged($updated, $oldStatus, $newStatus));

            return $updated->refresh();
        });
    }

    // ─────────────────────────────────────────────────────────────────────────

    private function canTransition(string $currentStatus, string $newStatus): bool
    {
        return in_array($newStatus, self::STATUS_TRANSITIONS[$currentStatus] ?? []);
    }

    private function applyVoucher(?string $code, int $userId, float $total): array
    {
        if (!$code) {
            return [null, 0.0];
        }

        // Bổ sung lockForUpdate() để ngăn user spam bắn request lấy nhiều voucher cùng lúc
        $voucher = Voucher::where('code', strtoupper($code))->lockForUpdate()->first();

        if (!$voucher) {
            throw VoucherException::notFound();
        }

        if ($voucher->used_count >= $voucher->quantity) {
            throw VoucherException::exhausted();
        }

        if ($voucher->status !== 'active'
            || ($voucher->start_date && $voucher->start_date > now())
            || ($voucher->end_date && $voucher->end_date < now())
        ) {
            throw VoucherException::expired();
        }

        if ($total < $voucher->min_order_value) {
            throw VoucherException::belowMinOrder($voucher->min_order_value);
        }

        if ($voucher->per_user_limit) {
            $used = VoucherUsage::where('voucher_id', $voucher->id)
                ->where('user_id', $userId)
                ->count();

            if ($used >= $voucher->per_user_limit) {
                throw VoucherException::userLimitReached();
            }
        }

        return [$voucher, $voucher->calcDiscount($total)];
    }
}
