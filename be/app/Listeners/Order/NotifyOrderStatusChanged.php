<?php

namespace App\Listeners\Order;

use App\Events\Order\OrderStatusChanged;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;

class NotifyOrderStatusChanged implements ShouldQueue
{
    public string $queue = 'notifications';

    public function handle(OrderStatusChanged $event): void
    {
        Log::info('Order status changed', [
            'order_id'   => $event->order->id,
            'old_status' => $event->oldStatus,
            'new_status' => $event->newStatus,
        ]);
        // TODO: gửi email / SMS thông báo thay đổi trạng thái
    }
}
