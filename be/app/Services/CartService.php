<?php


namespace App\Services;

use App\DTOs\Cart\AddToCartDTO;
use App\Exceptions\CartException;
use App\Exceptions\ProductException;
use App\Models\Cart;
use App\Models\CartItem;
use App\Repositories\Contracts\ProductRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

final class CartService
{
    public function __construct(
        private readonly ProductRepositoryInterface $productRepository,
    ) {}

    /**
     * Lấy giỏ hàng của user (với items và product info)
     */
    public function getCart(int $userId): Cart
    {
        return Cart::with([
            'items.product' => fn($q) => $q->with(['images' => fn($q) => $q->limit(1), 'discounts']),
        ])
            ->where('user_id', $userId)
            ->firstOrCreate(['user_id' => $userId]);
    }

    /**
     * Thêm sản phẩm vào giỏ hàng
     *
     * FIX RACE CONDITION:
     * - Bọc trong DB::transaction + lockForUpdate() để đảm bảo atomicity
     * - Dùng upsert với DB::raw("quantity + N") để tránh 2 request
     *   song song insert 2 row trùng nhau thay vì cộng dồn
     * - Unique constraint ở DB level là lớp bảo vệ cuối cùng
     */
    public function addItem(int $userId, AddToCartDTO $dto): Cart
    {
        DB::transaction(function () use ($userId, $dto) {
            // Lock row sản phẩm để tránh race condition khi đọc stock
            $product = DB::table('products')
                ->where('id', $dto->productId)
                ->lockForUpdate()
                ->first();

            if (!$product) {
                throw ProductException::notFound($dto->productId);
            }

            if ($product->stock <= 0) {
                throw ProductException::outOfStock($product->name);
            }

            // Lấy quantity hiện tại trong giỏ (nếu có) để validate tổng
            $cart = Cart::firstOrCreate(['user_id' => $userId]);

            $currentQtyInCart = CartItem::where('cart_id', $cart->id)
                ->where('product_id', $dto->productId)
                ->value('quantity') ?? 0;

            $newTotalQty = $currentQtyInCart + $dto->quantity;

            // FIX: Chỉ cần 1 check duy nhất — kiểm tra tổng quantity sau khi thêm.
            // Check riêng $dto->quantity < stock là THỪA (subset của check bên dưới)
            // và gây nhầm lẫn: VD stock=5, cart_has=4, add=3 → check riêng pass sai.
            if ($product->stock < $newTotalQty) {
                throw ProductException::insufficientStock($product->name, $product->stock);
            }

            // Atomic upsert:
            // - Nếu chưa có row → INSERT với quantity = $dto->quantity
            // - Nếu đã có row → UPDATE quantity += $dto->quantity
            // - Unique constraint ['cart_id', 'product_id'] đảm bảo không có duplicate
            CartItem::upsert(
                [[
                    'cart_id'    => $cart->id,
                    'product_id' => $dto->productId,
                    'quantity'   => $dto->quantity,
                ]],
                uniqueBy: ['cart_id', 'product_id'],
                update:   ['quantity' => DB::raw("quantity + {$dto->quantity}")],
            );

            Log::info('Cart item added', [
                'user_id'        => $userId,
                'product_id'     => $dto->productId,
                'quantity_added' => $dto->quantity,
                'total_qty'      => $newTotalQty,
            ]);
        });

        return $this->getCart($userId);
    }

    /**
     * Cập nhật số lượng 1 item trong giỏ
     */
    public function updateItem(int $userId, int $itemId, int $quantity): Cart
    {
        $cart = Cart::where('user_id', $userId)->first();

        if (!$cart) {
            throw CartException::empty();
        }

        /** @var CartItem|null $item */
        $item = $cart->items()->find($itemId);

        if (!$item) {
            throw CartException::itemNotFound();
        }

        $product = $this->productRepository->findById($item->product_id);

        if ($product && $product->stock < $quantity) {
            throw ProductException::insufficientStock($product->name, $product->stock);
        }

        $item->update(['quantity' => $quantity]);

        Log::info('Cart item updated', [
            'user_id'  => $userId,
            'item_id'  => $itemId,
            'quantity' => $quantity,
        ]);

        return $this->getCart($userId);
    }

    /**
     * Xóa 1 item khỏi giỏ hàng
     */
    public function removeItem(int $userId, int $itemId): Cart
    {
        $cart = Cart::where('user_id', $userId)->first();

        if (!$cart) {
            throw CartException::empty();
        }

        $item = $cart->items()->find($itemId);

        if (!$item) {
            throw CartException::itemNotFound();
        }

        $item->delete();

        Log::info('Cart item removed', [
            'user_id' => $userId,
            'item_id' => $itemId,
        ]);

        return $this->getCart($userId);
    }

    /**
     * Xóa toàn bộ giỏ hàng
     */
    public function clearCart(int $userId): void
    {
        $cart = Cart::where('user_id', $userId)->first();

        if ($cart) {
            $cart->items()->delete();
            Log::info('Cart cleared', ['user_id' => $userId]);
        }
    }

    /**
     * Tóm tắt giỏ hàng (dùng cho checkout preview)
     */
    public function getSummary(int $userId): array
    {
        $cart = $this->getCart($userId);

        if ($cart->items->isEmpty()) {
            return [
                'items_count' => 0,
                'total_price' => 0.0,
                'items'       => [],
            ];
        }

        $totalPrice = $cart->items->sum(
            fn($item) => $item->quantity * ($item->product?->final_price ?? 0)
        );

        return [
            'items_count' => $cart->items->sum('quantity'),
            'total_price' => round($totalPrice, 2),
            'items'       => $cart->items->map(fn($item) => [
                'id'          => $item->id,
                'product_id'  => $item->product_id,
                'name'        => $item->product?->name,
                'image'       => $item->product?->images->first()?->image_url,
                'price'       => (float) ($item->product?->price ?? 0),
                'final_price' => (float) ($item->product?->final_price ?? 0),
                'quantity'    => $item->quantity,
                'subtotal'    => round($item->quantity * ($item->product?->final_price ?? 0), 2),
                'stock'       => $item->product?->stock ?? 0,
            ])->values(),
        ];
    }
}
