<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $discount = $this->activeDiscount(); // 1 lần duy nhất để tối ưu performance

        return [
            'id'             => $this->id,
            'name'           => $this->name,
            'price'          => (float) $this->price,
            'final_price'    => $this->final_price,
            'original_price' => (float) $this->original_price,
            'stock'          => $this->stock,
            'material'       => $this->material,
            'category'       => $this->whenLoaded('category', fn() => [
                'id'   => $this->category->id,
                'name' => $this->category->name,
            ]),
            'image'          => $this->whenLoaded('images', fn() => $this->images->first()?->image_url),
            'avg_rating'     => round((float) ($this->reviews_avg_rating ?? $this->avg_rating ?? 0), 1),
            'has_discount'   => $discount !== null,
            'discount'       => $discount ? [
                'type'  => $discount->discount_type,
                'value' => (float) $discount->discount_value,
            ] : null,
        ];
    }
}
