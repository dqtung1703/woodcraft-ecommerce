<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    protected $fillable = [
        'name', 'description', 'original_price', 'cost_price',
        'price', 'stock', 'material', 'category_id',
    ];

    protected $casts = [
        'original_price' => 'decimal:2',
        'cost_price'     => 'decimal:2',
        'price'          => 'decimal:2',
        'stock'          => 'integer',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class);
    }

    public function discounts(): HasMany
    {
        return $this->hasMany(ProductDiscount::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function cartItems(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    public function views(): HasMany
    {
        return $this->hasMany(ProductView::class);
    }

    // Lấy discount đang active
    public function activeDiscount(): ?ProductDiscount
    {
        return $this->discounts()
            ->where('status', 'active')
            ->where('start_date', '<=', now())
            ->where('end_date', '>=', now())
            ->first();
    }

    // Tính giá sau discount
    public function getFinalPriceAttribute(): float
    {
        $discount = $this->activeDiscount();
        if (!$discount) return (float) $this->price;

        $basePrice = ($this->original_price && $this->original_price > 0)
            ? (float) $this->original_price
            : (float) $this->price;

        if ($discount->discount_type === 'percent') {
            return $basePrice * (1 - $discount->discount_value / 100);
        }
        return max(0, $basePrice - $discount->discount_value);
    }

    // Rating trung bình — dùng withAvg() preload nếu có, fallback query nếu không
    public function getAvgRatingAttribute(): float
    {
        // Nếu đã preload bởi withAvg('reviews', 'rating'), dùng cache đó
        if (isset($this->attributes['reviews_avg_rating'])) {
            return round((float) $this->attributes['reviews_avg_rating'], 1);
        }
        return round($this->reviews()->avg('rating') ?? 0, 1);
    }
}
