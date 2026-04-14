<?php

namespace App\Listeners\Order;

use App\Events\Order\OrderPlaced;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;

class NotifyOrderPlaced implements ShouldQueue
{
    public string $queue = 'notifications';

    public function handle(OrderPlaced $event): void
    {
        $order = $event->order;
        Log::info('Order placed notification', [
            'order_id'   => $order->id,
            'user_id'    => $order->user_id,
            'final_price'=> $order->final_price,
        ]);
        // TODO: gửi email xác nhận đơn hàng, push notification...
    }
}
