<?php

namespace App\Observers;

use App\Models\Product;
use Illuminate\Support\Facades\Log;

class ProductObserver
{
    public function creating(Product $product): void
    {
        // Giá gốc phải >= giá bán — throw rõ ràng thay vì silent fix
        if ($product->original_price < $product->price) {
            throw new \InvalidArgumentException(
                'original_price phải >= price. Giá gốc không thể thấp hơn giá bán.'
            );
        }
    }

    public function created(Product $product): void
    {
        Log::info('Product created', [
            'product_id' => $product->id,
            'name'       => $product->name,
            'price'      => $product->price,
        ]);
    }

    public function updated(Product $product): void
    {
        $changes = $product->getChanges();
        unset($changes['updated_at']);

        if (!empty($changes)) {
            Log::info('Product updated', [
                'product_id' => $product->id,
                'changes'    => $changes,
            ]);
        }

        // Cảnh báo tồn kho thấp
        if ($product->wasChanged('stock') && $product->stock <= 5 && $product->stock > 0) {
            Log::warning('Low stock alert', [
                'product_id' => $product->id,
                'name'       => $product->name,
                'stock'      => $product->stock,
            ]);
        }
    }

    public function deleted(Product $product): void
    {
        Log::info('Product deleted', [
            'product_id' => $product->id,
            'name'       => $product->name,
        ]);
    }
}
