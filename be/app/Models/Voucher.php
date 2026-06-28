<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Voucher extends Model
{
    protected $fillable = [
        'code', 'discount_type', 'discount_value', 'min_order_value',
        'max_discount', 'quantity', 'used_count', 'per_user_limit',
        'start_date', 'end_date', 'status',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date'   => 'datetime',
    ];

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function usages(): HasMany
    {
        return $this->hasMany(VoucherUsage::class);
    }

    public function isValid(): bool
    {
        return $this->status === 'active'
            && $this->used_count < $this->quantity
            && ($this->start_date === null || $this->start_date <= now())
            && ($this->end_date === null || $this->end_date >= now());
    }

    // Tính số tiền giảm
    public function calcDiscount(float $orderTotal): float
    {
        if ($orderTotal < $this->min_order_value) return 0;

        $discount = $this->discount_type === 'percent'
            ? $orderTotal * $this->discount_value / 100
            : $this->discount_value;

        if ($this->max_discount) {
            $discount = min($discount, $this->max_discount);
        }

        return min($discount, $orderTotal);
    }
}
