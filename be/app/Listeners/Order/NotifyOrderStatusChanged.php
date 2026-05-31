<?php

namespace App\Listeners\Order;

use App\Events\Order\OrderStatusChanged;
use App\Services\NotificationService;
use Illuminate\Support\Facades\Log;

class NotifyOrderStatusChanged
{
    public function __construct(private readonly NotificationService $notificationService) {}

    public function handle(OrderStatusChanged $event): void
    {
        try {
            $this->notificationService->createForOrderStatus($event->order, $event->newStatus);
        } catch (\Throwable $e) {
            Log::error('Failed to create order status change notification', [
                'order_id'   => $event->order->id,
                'new_status' => $event->newStatus,
                'error'      => $e->getMessage(),
            ]);
        }

        Log::info('Order status changed', [
            'order_id'   => $event->order->id,
            'old_status' => $event->oldStatus,
            'new_status' => $event->newStatus,
        ]);
    }
}
