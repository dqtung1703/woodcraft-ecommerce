<?php

namespace App\Providers;

use App\Events\Auth\UserLoggedIn;
use App\Events\Auth\UserRegistered;
use App\Events\Order\OrderPlaced;
use App\Events\Order\OrderStatusChanged;
use App\Listeners\Auth\SendWelcomeEmail;
use App\Listeners\Order\NotifyOrderPlaced;
use App\Listeners\Order\NotifyOrderStatusChanged;
use App\Models\Order;
use App\Models\Product;
use App\Observers\OrderObserver;
use App\Observers\ProductObserver;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        UserRegistered::class     => [SendWelcomeEmail::class],
        UserLoggedIn::class       => [],
        OrderPlaced::class        => [NotifyOrderPlaced::class],
        OrderStatusChanged::class => [NotifyOrderStatusChanged::class],
    ];

    public function boot(): void
    {
        Product::observe(ProductObserver::class);
        Order::observe(OrderObserver::class);
    }
}
