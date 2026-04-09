<?php

// =============================================
// app/DTOs/Voucher/CreateVoucherDTO.php
// =============================================
namespace App\DTOs\Voucher;

use Illuminate\Support\Carbon;

final readonly class CreateVoucherDTO
{
    public function __construct(
        public string     $code,
        public string     $discountType,
        public float      $discountValue,
        public float      $minOrderValue,
        public int        $quantity,
        public ?float     $maxDiscount = null,
        public ?int       $perUserLimit = null,
        public ?Carbon    $startDate = null,
        public ?Carbon    $endDate = null,
    ) {}

    public static function fromRequest(array $data): self
    {
        return new self(
            code:          $data['code'],
            discountType:  $data['discount_type'],
            discountValue: (float) $data['discount_value'],
            minOrderValue: (float) $data['min_order_value'],
            quantity:      (int) $data['quantity'],
            maxDiscount:   isset($data['max_discount']) ? (float) $data['max_discount'] : null,
            perUserLimit:  isset($data['per_user_limit']) ? (int) $data['per_user_limit'] : null,
            startDate:     isset($data['start_date']) ? Carbon::parse($data['start_date']) : null,
            endDate:       isset($data['end_date']) ? Carbon::parse($data['end_date']) : null,
        );
    }
}
