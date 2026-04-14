<?php

namespace App\Observers;

use App\Models\Order;
use Illuminate\Support\Facades\Log;

class OrderObserver
{
    public function created(Order $order): void
    {
        Log::info('Order created', [
            'order_id'    => $order->id,
            'user_id'     => $order->user_id,
            'final_price' => $order->final_price,
        ]);
    }

    public function updated(Order $order): void
    {
        if ($order->wasChanged('status')) {
            Log::info('Order status changed via observer', [
                'order_id'   => $order->id,
                'old_status' => $order->getOriginal('status'),
                'new_status' => $order->status,
            ]);
        }
    }
}
