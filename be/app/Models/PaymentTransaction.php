<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PaymentTransaction extends Model
{
    // Bảng audit log — chỉ ghi, không sửa
    // Mỗi row là 1 event bất biến (created_at only, không có updated_at)
    public $timestamps    = false;
    const  CREATED_AT     = 'created_at';

    protected $fillable = [
        'payment_id',
        'order_id',
        'gateway',         // vnpay | momo
        'type',            // initiate | ipn | return | refund
        'direction',       // outbound | inbound
        'raw_request',
        'raw_response',
        'signature_valid',
        'status_code',
        'http_status',
        'ip_address',
        'note',
    ];

    protected $casts = [
        'raw_request'    => 'array',
        'raw_response'   => 'array',
        'signature_valid'=> 'boolean',
        'http_status'    => 'integer',
        'created_at'     => 'datetime',
    ];

    // ── Relationships ─────────────────────────────────────────────────────────

    public function payment(): BelongsTo
    {
        return $this->belongsTo(Payment::class);
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    public function isInbound(): bool
    {
        return $this->direction === 'inbound';
    }

    public function isSignatureValid(): bool
    {
        return $this->signature_valid === true;
    }
}
