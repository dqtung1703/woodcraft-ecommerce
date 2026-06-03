<?php

namespace App\Repositories\Eloquent;

use App\DTOs\Product\ProductFilterDTO;
use App\Models\Product;
use App\Models\ProductImage;
use App\Repositories\Contracts\ProductRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class ProductRepository implements ProductRepositoryInterface
{
    public function __construct(private readonly Product $model) {}

    public function findById(int $id, array $with = []): ?Product
    {
        return $this->model->with($with)->find($id);
    }

    public function findByIdOrFail(int $id, array $with = []): Product
    {
        return $this->model->with($with)->findOrFail($id);
    }

    public function paginate(ProductFilterDTO $filter): LengthAwarePaginator
    {
        $query = $this->model
            ->with(['category', 'images' => fn($q) => $q->limit(1), 'discounts'])
            ->withAvg('reviews', 'rating')   // Preload avg rating — tránh N+1
            ->when($filter->search,     fn($q) => $q->where(fn($sub) =>
                $sub->where('name', 'like', "%{$filter->search}%")
                    ->orWhere('description', 'like', "%{$filter->search}%")
            ))
            ->when($filter->categoryId, fn($q) => $q->where('category_id', $filter->categoryId))
            ->when($filter->minPrice,   fn($q) => $q->where('price', '>=', $filter->minPrice))
            ->when($filter->maxPrice,   fn($q) => $q->where('price', '<=', $filter->maxPrice))
            ->when($filter->material,   fn($q) => $q->where('material', $filter->material))
            ->orderBy($filter->sortBy, $filter->sortDir);

        return $query->paginate($filter->perPage);
    }

    public function create(array $data): Product
    {
        return $this->model->create($data);
    }

    public function update(Product $product, array $data): Product
    {
        $product->update($data);
        return $product->fresh(['category', 'images', 'discounts']);
    }

    public function delete(Product $product): void
    {
        $product->images()->delete();
        $product->delete();
    }

    public function getRelated(Product $product, int $limit = 8): Collection
    {
        return $this->model
            ->with(['images' => fn($q) => $q->limit(1), 'discounts'])
            ->where('id', '!=', $product->id)
            ->where(fn($q) => $q
                ->where('category_id', $product->category_id)
                ->orWhere('material', $product->material)
            )
            ->withCount('views')
            ->orderByDesc('views_count')
            ->limit($limit)
            ->get();
    }

    public function decrementStock(int $productId, int $quantity): void
    {
        $this->model->where('id', $productId)->decrement('stock', $quantity);
    }

    public function incrementStock(int $productId, int $quantity): void
    {
        $this->model->where('id', $productId)->increment('stock', $quantity);
    }

    public function incrementSoldCount(int $productId, int $quantity): void
    {
        $this->model->where('id', $productId)->increment('sold_count', $quantity);
    }

    public function decrementSoldCount(int $productId, int $quantity): void
    {
        $this->model->where('id', $productId)->decrement('sold_count', $quantity);
    }

    /**
     * Sync ảnh sản phẩm: xóa cũ, insert batch mới.
     * Không nằm trong Interface vì chỉ dùng nội bộ ProductService.
     */
    public function syncImages(Product $product, array $imageUrls): void
    {
        $product->images()->delete();

        $records = array_map(fn($url) => [
            'product_id' => $product->id,
            'image_url'  => $url,
            'created_at' => now(),
            'updated_at' => now(),
        ], $imageUrls);

        ProductImage::insert($records);
    }
}
