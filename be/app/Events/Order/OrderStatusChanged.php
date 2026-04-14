<?php

namespace App\Events\Order;

use App\Models\Order;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OrderStatusChanged
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public readonly Order  $order,
        public readonly string $oldStatus,
        public readonly string $newStatus,
    ) {}
}
