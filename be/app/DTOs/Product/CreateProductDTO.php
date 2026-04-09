<?php

// =============================================
// app/DTOs/Product/CreateProductDTO.php
// =============================================
namespace App\DTOs\Product;

final readonly class CreateProductDTO
{
    public function __construct(
        public string  $name,
        public float   $originalPrice,
        public float   $price,
        public int     $stock,
        public int     $categoryId,
        public ?string $description = null,
        public ?string $material = null,
        public array   $images = [],
    ) {}

    public static function fromRequest(array $data): self
    {
        return new self(
            name:          $data['name'],
            originalPrice: (float) $data['original_price'],
            price:         (float) $data['price'],
            stock:         (int) $data['stock'],
            categoryId:    (int) $data['category_id'],
            description:   $data['description'] ?? null,
            material:      $data['material'] ?? null,
            images:        $data['images'] ?? [],
        );
    }
}