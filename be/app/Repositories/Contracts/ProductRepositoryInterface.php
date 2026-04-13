<?php

namespace App\Repositories\Contracts;

use App\DTOs\Product\ProductFilterDTO;
use App\Models\Product;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface ProductRepositoryInterface
{
    public function findById(int $id, array $with = []): ?Product;
    public function findByIdOrFail(int $id, array $with = []): Product;
    public function paginate(ProductFilterDTO $filter): LengthAwarePaginator;
    public function create(array $data): Product;
    public function update(Product $product, array $data): Product;
    public function delete(Product $product): void;
    public function getRelated(Product $product, int $limit = 8): Collection;
    public function decrementStock(int $productId, int $quantity): void;
    public function incrementStock(int $productId, int $quantity): void;
}
