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
        'pending'   => ['confirmed', 'cancelled'],
        'confirmed' => ['shipping', 'cancelled'],
        'shipping'  => ['delivered'],
        'delivered' => [],
        'cancelled' => [],
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

    public function getAllOrders(array $filters = []): LengthAwarePaginator
    {
        return $this->orderRepository->paginateAll($filters);
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

            // 4. Tạo đơn hàng
            $order = $this->orderRepository->create([
                'user_id'         => $dto->userId,
                'total_price'     => $totalPrice,
                'discount_amount' => $discountAmount,
                'final_price'     => $finalPrice,
                'voucher_id'      => $voucher?->id,
                'status'          => 'pending',
                'note'            => $dto->note,
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
            Payment::create([
                'order_id' => $order->id,
                'method'   => $dto->paymentMethod,
                'status'   => 'pending',
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
            $cart->items()->delete();

            // 9. Dispatch event
            event(new OrderPlaced($order));

            Log::info('Order placed successfully', [
                'order_id'    => $order->id,
                'user_id'     => $dto->userId,
                'total_price' => $totalPrice,
                'final_price' => $finalPrice,
                'voucher'     => $voucher?->code,
            ]);

            return $order->load(['items.product', 'payment', 'voucher']);
        });
    }

    /**
     * User tự hủy đơn (chỉ hủy được khi đang pending)
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

        if (!$this->canTransition($order->status, 'cancelled')) {
            throw OrderException::cannotCancel();
        }

        return DB::transaction(function () use ($order) {
            // Hoàn tồn kho
            foreach ($order->items as $item) {
                $this->productRepository->incrementStock($item->product_id, $item->quantity);
            }

            // Hoàn voucher usage
            if ($order->voucher_id) {
                $lockedVoucher = Voucher::where('id', $order->voucher_id)->lockForUpdate()->first();
                VoucherUsage::where('order_id', $order->id)->delete();
                if ($lockedVoucher) {
                    $lockedVoucher->decrement('used_count');
                }
            }

            $oldStatus = $order->status;
            $updated   = $this->orderRepository->updateStatus($order, 'cancelled');
            $updated->payment?->update(['status' => 'refunded']);

            event(new OrderStatusChanged($updated, $oldStatus, 'cancelled'));

            return $updated;
        });
    }

    /**
     * Admin cập nhật trạng thái đơn hàng
     */
    public function updateStatus(int $orderId, string $newStatus): Order
    {
        $order = $this->orderRepository->findById($orderId, ['items.product', 'payment']);

        if (!$order) {
            throw OrderException::notFound($orderId);
        }

        if (!$this->canTransition($order->status, $newStatus)) {
            throw OrderException::invalidStatusTransition($order->status, $newStatus);
        }

        $oldStatus = $order->status;

        return DB::transaction(function () use ($order, $newStatus, $oldStatus) {
            $updated = $this->orderRepository->updateStatus($order, $newStatus);

            // Cập nhật payment khi delivered
            if ($newStatus === 'delivered') {
                $updated->payment?->update(['status' => 'paid', 'paid_at' => now()]);
            }

            // Hoàn tồn kho khi admin hủy
            if ($newStatus === 'cancelled' && $oldStatus !== 'cancelled') {
                foreach ($order->items as $item) {
                    $this->productRepository->incrementStock($item->product_id, $item->quantity);
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

            return $updated;
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
