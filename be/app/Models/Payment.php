<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Payment extends Model
{
    // Bật timestamps — cần cho audit và debug
    // (cũ: $timestamps = false — đã sửa)
    public $timestamps = true;

    protected $fillable = [
        'order_id',
        'payment_method',       // cod | banking | vnpay | momo
        'payment_status',       // unpaid | pending | paid | failed | cancelled | expired | refunded
        'amount',               // = order.final_price, dùng để verify với IPN
        'transaction_id',       // UUID nội bộ (requestId MoMo)
        'gateway_transaction_id', // ID từ gateway (vnp_TxnRef / orderId MoMo)
        'gateway_response',     // Full response cuối từ gateway (json)
        'paid_at',
        'expired_at',
    ];

    protected $casts = [
        'amount'           => 'decimal:2',
        'paid_at'          => 'datetime',
        'expired_at'       => 'datetime',
        'gateway_response' => 'array',
    ];

    // ── Status helpers ────────────────────────────────────────────────────────

    public function isPending(): bool
    {
        return $this->payment_status === 'pending';
    }

    public function isPaid(): bool
    {
        return $this->payment_status === 'paid';
    }

    public function isUnpaid(): bool
    {
        return $this->payment_status === 'unpaid';
    }

    public function canRetry(): bool
    {
        return $this->isOnlineMethod()
            && in_array($this->payment_status, ['pending', 'failed', 'cancelled', 'expired'], true);
    }

    public function isOnlineMethod(): bool
    {
        return in_array($this->payment_method, ['vnpay', 'momo']);
    }

    // ── Relationships ─────────────────────────────────────────────────────────

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(PaymentTransaction::class);
    }
}
