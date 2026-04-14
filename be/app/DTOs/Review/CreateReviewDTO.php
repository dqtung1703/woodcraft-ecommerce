<?php

// =============================================
// app/DTOs/Review/CreateReviewDTO.php
// =============================================
namespace App\DTOs\Review;

final readonly class CreateReviewDTO
{
    public function __construct(
        public int     $userId,
        public int     $productId,
        public int     $rating,
        public ?string $comment,
    ) {}

    public static function fromRequest(array $data, int $userId): self
    {
        return new self(
            userId:    $userId,
            productId: (int) $data['product_id'],
            rating:    (int) $data['rating'],
            comment:   $data['comment'] ?? null,
        );
    }
}
