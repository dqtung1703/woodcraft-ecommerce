<?php

namespace App\Providers;

use App\Repositories\Contracts\OrderRepositoryInterface;
use App\Repositories\Contracts\ProductRepositoryInterface;
use App\Repositories\Contracts\UserRepositoryInterface;
use App\Repositories\Eloquent\OrderRepository;
use App\Repositories\Eloquent\ProductRepository;
use App\Repositories\Eloquent\UserRepository;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $bindings = [
            UserRepositoryInterface::class    => UserRepository::class,
            ProductRepositoryInterface::class => ProductRepository::class,
            OrderRepositoryInterface::class   => OrderRepository::class,
        ];

        foreach ($bindings as $interface => $implementation) {
            $this->app->bind($interface, $implementation);
        }
    }
}
