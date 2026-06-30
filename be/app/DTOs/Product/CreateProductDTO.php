<?php


namespace App\DTOs\Product;

use Illuminate\Http\UploadedFile;

final readonly class CreateProductDTO
{
    public function __construct(
        public string  $name,
        public float   $originalPrice,
        public float   $costPrice,
        public float   $price,
        public int     $stock,
        public int     $categoryId,
        public ?string $description       = null,
        public ?string $material          = null,
        public array   $imageFiles        = [],   // UploadedFile[]
        public ?string $discountType      = null,
        public ?float  $discountValue     = null,
        public ?string $discountStartDate = null,
        public ?string $discountEndDate   = null,
    ) {}

    public static function fromRequest(array $data): self
    {
        return new self(
            name:              $data['name'],
            originalPrice:     (float) $data['original_price'],
            costPrice:         isset($data['cost_price'])
                ? (float) $data['cost_price']
                : round((float) $data['original_price'] * 0.5, 2),
            price:             (float) $data['price'],
            stock:             (int) $data['stock'],
            categoryId:        (int) $data['category_id'],
            description:       $data['description'] ?? null,
            material:          $data['material'] ?? null,
            imageFiles:        $data['images'] ?? [],
            discountType:      $data['discount_type'] ?? null,
            discountValue:     isset($data['discount_value']) ? (float) $data['discount_value'] : null,
            discountStartDate: $data['discount_start_date'] ?? null,
            discountEndDate:   $data['discount_end_date'] ?? null,
        );
    }
}
