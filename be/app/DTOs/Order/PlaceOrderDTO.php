<?php


namespace App\DTOs\Order;

final readonly class PlaceOrderDTO
{
    public function __construct(
        public int     $userId,
        public string  $paymentMethod,
        public string  $shippingName,
        public string  $shippingPhone,
        public string  $shippingAddress,
        public ?string $voucherCode = null,
        public ?string $note = null,
    ) {}

    public static function fromRequest(array $data, int $userId): self
    {
        return new self(
            userId:          $userId,
            paymentMethod:   $data['payment_method'],
            shippingName:    $data['shipping_name'],
            shippingPhone:   $data['shipping_phone'],
            shippingAddress: $data['shipping_address'],
            voucherCode:     $data['voucher_code'] ?? null,
            note:            $data['note'] ?? null,
        );
    }
}
