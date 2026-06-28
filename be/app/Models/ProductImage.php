<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductImage extends Model
{
    public $timestamps = false;
    protected $fillable = ['product_id', 'image_url'];

    protected $casts = ['created_at' => 'datetime'];

    // Tự set created_at = now() khi insert vì timestamps = false
    protected static function booted(): void
    {
        static::creating(fn($model) => $model->created_at ??= now());
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
