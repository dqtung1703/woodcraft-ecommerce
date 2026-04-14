<?php

// =============================================
// app/DTOs/Product/UpdateProductDTO.php
// =============================================
namespace App\DTOs\Product;

final readonly class UpdateProductDTO
{
    public function __construct(
        public ?string $name = null,
        public ?float  $originalPrice = null,
        public ?float  $price = null,
        public ?int    $stock = null,
        public ?int    $categoryId = null,
        public ?string $description = null,
        public ?string $material = null,
        public ?array  $images = null,
    ) {}

    public static function fromRequest(array $data): self
    {
        return new self(
            name:          $data['name'] ?? null,
            originalPrice: isset($data['original_price']) ? (float) $data['original_price'] : null,
            price:         isset($data['price']) ? (float) $data['price'] : null,
            stock:         isset($data['stock']) ? (int) $data['stock'] : null,
            categoryId:    isset($data['category_id']) ? (int) $data['category_id'] : null,
            description:   $data['description'] ?? null,
            material:      $data['material'] ?? null,
            images:        isset($data['images']) ? $data['images'] : null,
        );
    }
}
