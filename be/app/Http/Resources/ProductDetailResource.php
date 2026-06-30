<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $discount = $this->activeDiscount(); // 1 lần duy nhất

        $realPercent = 0;
        if ($discount) {
            $displayOriginalPrice = ($this->original_price && $this->original_price > 0)
                ? (float) $this->original_price
                : (float) $this->price;
            $finalPrice = $this->final_price;

            if ($displayOriginalPrice > $finalPrice) {
                $realPercent = (int) round((($displayOriginalPrice - $finalPrice) / $displayOriginalPrice) * 100);
            }
        }

        return [
            'id'             => $this->id,
            'name'           => $this->name,
            'description'    => $this->description,
            'original_price' => (float) $this->original_price,
            'cost_price'     => (float) $this->cost_price,
            'price'          => (float) $this->price,
            'final_price'    => $this->final_price,
            'stock'          => $this->stock,
            'material'       => $this->material,
            'category'       => $this->whenLoaded('category', fn() => [
                'id'   => $this->category->id,
                'name' => $this->category->name,
            ]),
            'images'         => $this->whenLoaded('images', fn() =>
                $this->images->pluck('image_url')
            ),
            'avg_rating'     => round((float) ($this->reviews_avg_rating ?? $this->avg_rating ?? 0), 1),
            'reviews_count'  => $this->whenLoaded('reviews', fn() => $this->reviews->count()),
            'reviews'        => $this->whenLoaded('reviews', fn() =>
                $this->reviews->map(fn($r) => [
                    'id'         => $r->id,
                    'rating'     => $r->rating,
                    'comment'    => $r->comment,
                    'user'       => $r->user?->name,
                    'created_at' => $r->created_at?->format('d/m/Y'),
                ])
            ),
            'discount'       => $discount ? [
                'type'       => 'percent',
                'value'      => $realPercent,
                'start_date' => $discount->start_date?->toIso8601String(),
                'end_date'   => $discount->end_date?->toIso8601String(),
            ] : null,
            'created_at'     => $this->created_at?->format('d/m/Y'),
        ];
    }
}
