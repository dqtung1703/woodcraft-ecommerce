<?php


namespace App\DTOs\Product;

use Illuminate\Http\UploadedFile;

final readonly class UpdateProductDTO
{
    public function __construct(
        public ?string $name              = null,
        public ?float  $originalPrice     = null,
        public ?float  $costPrice         = null,
        public ?float  $price             = null,
        public ?int    $stock             = null,
        public ?int    $categoryId        = null,
        public ?string $description       = null,
        public ?string $material          = null,
        public ?array  $imageFiles        = null,   // UploadedFile[] | null
        public ?array  $keepImages        = null,   // string[] URL | null
        public bool    $replaceImages     = false,  // true khi admin muốn cập nhật ảnh
        public ?string $discountType      = null,
        public ?float  $discountValue     = null,
        public ?string $discountStartDate = null,
        public ?string $discountEndDate   = null,
    ) {}

    public static function fromRequest(array $data): self
    {
        return new self(
            name:              $data['name'] ?? null,
            originalPrice:     isset($data['original_price']) ? (float) $data['original_price'] : null,
            costPrice:         isset($data['cost_price'])     ? (float) $data['cost_price']     : null,
            price:             isset($data['price'])          ? (float) $data['price']          : null,
            stock:             isset($data['stock'])          ? (int) $data['stock']             : null,
            categoryId:        isset($data['category_id'])   ? (int) $data['category_id']       : null,
            description:       $data['description'] ?? null,
            material:          $data['material'] ?? null,
            imageFiles:        $data['images'] ?? null,
            keepImages:        $data['keep_images'] ?? null,
            replaceImages:     (bool) ($data['replace_images'] ?? false),
            discountType:      $data['discount_type'] ?? null,
            discountValue:     isset($data['discount_value']) ? (float) $data['discount_value'] : null,
            discountStartDate: $data['discount_start_date'] ?? null,
            discountEndDate:   $data['discount_end_date'] ?? null,
        );
    }
}
