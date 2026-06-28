<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VoucherUsage extends Model
{
    // Migration tạo bảng tên 'voucher_usage' (số ít) — khai báo tường minh để tránh auto-pluralize
    protected $table = 'voucher_usage';

    public $timestamps = false;
    protected $fillable = ['voucher_id', 'user_id', 'order_id', 'used_at'];

    protected $casts = ['used_at' => 'datetime'];

    public function voucher(): BelongsTo
    {
        return $this->belongsTo(Voucher::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}