<?php

// =============================================
// app/Models/ProductDiscount.php
// =============================================
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductDiscount extends Model
{
    protected $fillable = [
        'product_id', 'discount_type', 'discount_value',
        'start_date', 'end_date', 'status',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date'   => 'datetime',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}