<?php

// =============================================
// config/payment.php
// =============================================
return [

    'vnpay' => [
        'tmn_code'    => env('VNPAY_TMN_CODE', ''),
        'hash_secret' => env('VNPAY_HASH_SECRET', ''),
        'pay_url'     => env('VNPAY_PAY_URL', 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'),
        'return_url'  => env('APP_FRONTEND_URL', 'http://localhost:5173') . '/payment/return/vnpay',
        'ipn_url'     => env('APP_URL', 'http://localhost') . '/api/v1/payments/vnpay/ipn',
        // Thời hạn thanh toán (phút). VNPay tối đa 15 phút trên sandbox
        'expire_minutes' => (int) env('VNPAY_EXPIRE_MINUTES', 15),
    ],

    'momo' => [
        'partner_code' => env('MOMO_PARTNER_CODE', ''),
        'access_key'   => env('MOMO_ACCESS_KEY', ''),
        'secret_key'   => env('MOMO_SECRET_KEY', ''),
        'endpoint'     => env('MOMO_ENDPOINT', 'https://test-payment.momo.vn'),
        'return_url'   => env('APP_FRONTEND_URL', 'http://localhost:5173') . '/payment/return/momo',
        'notify_url'   => env('APP_URL', 'http://localhost') . '/api/v1/payments/momo/ipn',
        'expire_minutes' => (int) env('MOMO_EXPIRE_MINUTES', 15),
    ],

];
