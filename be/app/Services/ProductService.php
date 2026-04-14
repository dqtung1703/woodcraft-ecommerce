<?php

namespace App\Services;

use App\DTOs\Product\CreateProductDTO;
use App\DTOs\Product\ProductFilterDTO;
use App\DTOs\Product\UpdateProductDTO;
use App\Exceptions\ProductException;
use App\Models\Product;
use App\Models\ProductView;
use App\Repositories\Contracts\ProductRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

final class ProductService
{
    public function __construct(
        private readonly ProductRepositoryInterface $productRepository
    ) {}

    public function list(ProductFilterDTO $dto): LengthAwarePaginator
    {
        return $this->productRepository->paginate($dto);
    }

    public function findOrFail(int $id, ?int $userId = null): Product
    {
        $product = $this->productRepository->findById(
            $id,
            ['category', 'images', 'discounts', 'reviews.user']
        );

        if (!$product) {
            throw ProductException::notFound($id);
        }

        try {
            $this->recordView($id, $userId, request());
        } catch (\Throwable $e) {
            Log::warning('Failed to record product view', ['product_id' => $id, 'error' => $e->getMessage()]);
        }

        return $product;
    }

    private function recordView(int $productId, ?int $userId, $request): void
    {
        $ipHash = hash('xxh3', $request->ip() ?? 'unknown');
        
        if ($userId) {
            ProductView::upsert(
                [
                    'user_id'    => $userId,
                    'ip_hash'    => null,
                    'product_id' => $productId,
                    'viewed_at'  => now(),
                ],
                uniqueBy: ['user_id', 'product_id'],
                update:   ['viewed_at']
            );
        } else {
            ProductView::upsert(
                [
                    'user_id'    => null,
                    'ip_hash'    => $ipHash,
                    'product_id' => $productId,
                    'viewed_at'  => now(),
                ],
                uniqueBy: ['ip_hash', 'product_id'],
                update:   ['viewed_at']
            );
        }
    }

    public function create(CreateProductDTO $dto): Product
    {
        return DB::transaction(function () use ($dto) {
            $product = $this->productRepository->create([
                'name'           => $dto->name,
                'original_price' => $dto->originalPrice,
                'price'          => $dto->price,
                'stock'          => $dto->stock,
                'category_id'    => $dto->categoryId,
                'description'    => $dto->description,
                'material'       => $dto->material,
            ]);

            if (!empty($dto->images)) {
                $this->productRepository->syncImages($product, $dto->images);
            }

            return $product->load(['category', 'images', 'discounts']);
        });
    }

    public function update(int $id, UpdateProductDTO $dto): Product
    {
        return DB::transaction(function () use ($id, $dto) {
            $product = $this->productRepository->findByIdOrFail($id);

            $dataToUpdate = [];
            if ($dto->name !== null) $dataToUpdate['name'] = $dto->name;
            if ($dto->originalPrice !== null) $dataToUpdate['original_price'] = $dto->originalPrice;
            if ($dto->price !== null) $dataToUpdate['price'] = $dto->price;
            if ($dto->stock !== null) $dataToUpdate['stock'] = $dto->stock;
            if ($dto->categoryId !== null) $dataToUpdate['category_id'] = $dto->categoryId;
            if ($dto->description !== null) $dataToUpdate['description'] = $dto->description;
            if ($dto->material !== null) $dataToUpdate['material'] = $dto->material;

            if (!empty($dataToUpdate)) {
                $product = $this->productRepository->update($product, $dataToUpdate);
            }

            if ($dto->images !== null) {
                $this->productRepository->syncImages($product, $dto->images);
            }

            return $product->load(['category', 'images', 'discounts']);
        });
    }

    public function delete(int $id): void
    {
        $product = $this->productRepository->findByIdOrFail($id);
        $this->productRepository->delete($product);
    }

    public function getRelated(int $id): Collection
    {
        $product = $this->productRepository->findById($id);

        if (!$product) {
            throw ProductException::notFound($id);
        }

        return $this->productRepository->getRelated($product);
    }
}
