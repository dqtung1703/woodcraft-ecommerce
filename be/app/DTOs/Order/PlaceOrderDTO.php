<?php


// =============================================
// app/DTOs/Order/PlaceOrderDTO.php
// =============================================
namespace App\DTOs\Order;

final readonly class PlaceOrderDTO
{
    public function __construct(
        public int     $userId,
        public string  $paymentMethod,
        public ?string $voucherCode = null,
        public ?string $note = null,
    ) {}

    public static function fromRequest(array $data, int $userId): self
    {
        return new self(
            userId:        $userId,
            paymentMethod: $data['payment_method'],
            voucherCode:   $data['voucher_code'] ?? null,
            note:          $data['note'] ?? null,
        );
    }
}
