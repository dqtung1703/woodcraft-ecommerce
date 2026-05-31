<?php

namespace App\Listeners\Order;

use App\Events\Order\OrderPlaced;
use App\Services\NotificationService;
use Illuminate\Support\Facades\Log;

class NotifyOrderPlaced
{
    public function __construct(private readonly NotificationService $notificationService) {}

    public function handle(OrderPlaced $event): void
    {
        $order = $event->order;
        try {
            $this->notificationService->createForAdminNewOrder($order);
        } catch (\Throwable $e) {
            Log::error('Failed to create order placement notification', [
                'order_id' => $order->id,
                'error'    => $e->getMessage(),
            ]);
        }

        Log::info('Order placed notification', [
            'order_id'    => $order->id,
            'user_id'     => $order->user_id,
            'final_price' => $order->final_price,
        ]);
    }
}
