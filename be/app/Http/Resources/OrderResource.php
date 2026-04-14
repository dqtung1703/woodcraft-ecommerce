<?php

// =============================================
// app/Http/Resources/OrderResource.php
// =============================================
namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'              => $this->id,
            'status'          => $this->status,
            'status_label'    => $this->getStatusLabel(),
            'total_price'     => (float) $this->total_price,
            'discount_amount' => (float) $this->discount_amount,
            'final_price'     => (float) $this->final_price,
            'items_count'     => $this->whenLoaded('items', fn() => $this->items->count()),
            'payment_method'  => $this->whenLoaded('payment', fn() => $this->payment?->method),
            'payment_status'  => $this->whenLoaded('payment', fn() => $this->payment?->status),
            'voucher_code'    => $this->whenLoaded('voucher', fn() => $this->voucher?->code),
            'items'           => $this->whenLoaded('items', fn() =>
                $this->items->map(fn($i) => [
                    'product_id'   => $i->product_id,
                    'product_name' => $i->product?->name,
                    'image'        => $i->product?->images->first()?->image_url,
                    'price'        => (float) $i->price,
                    'quantity'     => $i->quantity,
                    'subtotal'     => (float) ($i->price * $i->quantity),
                ])
            ),
            'created_at'      => $this->created_at?->format('d/m/Y H:i'),
        ];
    }

    private function getStatusLabel(): string
    {
        return match ($this->status) {
            'pending'   => 'Chờ xác nhận',
            'confirmed' => 'Đã xác nhận',
            'shipping'  => 'Đang giao hàng',
            'delivered' => 'Đã giao hàng',
            'cancelled' => 'Đã hủy',
            default     => $this->status,
        };
    }
}
