<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Order extends Model
{
    protected $fillable = [
        'user_id', 'total_price', 'discount_amount',
        'final_price', 'voucher_id', 'status', 'note',
        // Shipping snapshot — lưu tại thời điểm đặt hàng, không thay đổi khi user sửa profile
        'shipping_name', 'shipping_phone', 'shipping_address',
    ];

    protected $casts = [
        'total_price'     => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'final_price'     => 'decimal:2',
    ];

    // Status: pending | confirmed | processing | shipping | delivered | cancelled
    // processing: online payment thành công, đang chuẩn bị hàng (trước confirmed)
    const STATUSES = ['pending', 'confirmed', 'processing', 'shipping', 'delivered', 'cancelled'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function voucher(): BelongsTo
    {
        return $this->belongsTo(Voucher::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class);
    }

    public function voucherUsage(): HasOne
    {
        return $this->hasOne(VoucherUsage::class);
    }
}
