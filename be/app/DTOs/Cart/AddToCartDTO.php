<?php


namespace App\DTOs\Cart;

final readonly class AddToCartDTO
{
    public function __construct(
        public int $productId,
        public int $quantity,
    ) {}

    public static function fromRequest(array $data): self
    {
        return new self(
            productId: (int) $data['product_id'],
            quantity:  (int) $data['quantity'],
        );
    }
}
