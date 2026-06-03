<?php

// =============================================
// app/DTOs/Product/ProductFilterDTO.php
// =============================================
namespace App\DTOs\Product;

final readonly class ProductFilterDTO
{
    public function __construct(
        public ?string $search = null,
        public ?int    $categoryId = null,
        public ?float  $minPrice = null,
        public ?float  $maxPrice = null,
        public ?string $material = null,
        public string  $sortBy = 'created_at',
        public string  $sortDir = 'desc',
        public int     $perPage = 12,
    ) {}

    public static function fromRequest(array $data): self
    {
        $allowedSorts = ['price', 'name', 'created_at', 'stock', 'sold_count'];
        $sortBy = in_array($data['sort_by'] ?? '', $allowedSorts)
            ? $data['sort_by']
            : 'created_at';

        return new self(
            search:     $data['search'] ?? null,
            categoryId: isset($data['category_id']) ? (int) $data['category_id'] : null,
            minPrice:   isset($data['min_price']) ? (float) $data['min_price'] : null,
            maxPrice:   isset($data['max_price']) ? (float) $data['max_price'] : null,
            material:   $data['material'] ?? null,
            sortBy:     $sortBy,
            sortDir:    ($data['sort_dir'] ?? 'desc') === 'asc' ? 'asc' : 'desc',
            perPage:    min((int) ($data['per_page'] ?? 12), 50),
        );
    }
}
