<?php

// =============================================
// app/Models/Payment.php
// =============================================
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    public $timestamps = false;
    protected $fillable = ['order_id', 'method', 'status', 'paid_at'];

    protected $casts = ['paid_at' => 'datetime'];

    // method: cod, vnpay, momo, banking  |  status: pending, paid, failed, refunded
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}