<?php

namespace App\Providers;

use App\Services\Payment\MomoPaymentService;
use App\Services\Payment\VnpayPaymentService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Bind VnpayPaymentService với config từ config/payment.php
        $this->app->singleton(VnpayPaymentService::class, function () {
            return new VnpayPaymentService(
                tmnCode:       config('payment.vnpay.tmn_code'),
                hashSecret:    config('payment.vnpay.hash_secret'),
                payUrl:        config('payment.vnpay.pay_url'),
                returnUrl:     config('payment.vnpay.return_url'),
                expireMinutes: config('payment.vnpay.expire_minutes', 15),
            );
        });

        // Bind MomoPaymentService với config từ config/payment.php
        $this->app->singleton(MomoPaymentService::class, function () {
            return new MomoPaymentService(
                partnerCode:   config('payment.momo.partner_code'),
                accessKey:     config('payment.momo.access_key'),
                secretKey:     config('payment.momo.secret_key'),
                endpoint:      config('payment.momo.endpoint'),
                returnUrl:     config('payment.momo.return_url'),
                notifyUrl:     config('payment.momo.notify_url'),
                expireMinutes: config('payment.momo.expire_minutes', 15),
            );
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
