<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ChatbotController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\VoucherController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    // ── Payment IPN — Public (không có auth, verify bằng chữ ký HMAC) ────────────────────
    // Route::match vì VNPay sandbox có thể gửi GET hoặc POST tùy cấu hình
    Route::match(['get', 'post'], '/payments/vnpay/ipn', [PaymentController::class, 'vnpayIpn'])
         ->name('payment.vnpay.ipn');
    Route::post('/payments/momo/ipn', [PaymentController::class, 'momoIpn'])
         ->name('payment.momo.ipn');

    // ── Public (60 req/min) ──────────────────────────────────────────────────────────
    Route::middleware('throttle:60,1')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login',    [AuthController::class, 'login'])->middleware('throttle:10,1');
        Route::post('/auth/google', [AuthController::class, 'googleLogin'])->middleware('throttle:10,1');

        Route::get('/products',              [ProductController::class, 'index']);
        Route::get('/products/{id}',         [ProductController::class, 'show']);
        Route::get('/products/{id}/related', [ProductController::class, 'related']);
        Route::get('/categories',            [CategoryController::class, 'index']);
        Route::get('/categories/{id}',       [CategoryController::class, 'show']);
        Route::get('/products/{productId}/reviews', [ReviewController::class, 'index']);
        Route::post('/chatbot', [ChatbotController::class, 'chat'])->middleware('throttle:20,1');
        Route::delete('/chatbot/history',    [ChatbotController::class, 'clearHistory'])->middleware('throttle:20,1');
    });

    // ── Authenticated (120 req/min) ────────────────────────────────────────
    Route::middleware(['auth:sanctum', 'active', 'throttle:120,1'])->group(function () {

        Route::post('/logout',           [AuthController::class, 'logout']);
        Route::get('/profile',           [AuthController::class, 'profile']);
        Route::put('/profile',           [AuthController::class, 'updateProfile']);   // UC04
        Route::put('/profile/password',  [AuthController::class, 'changePassword']);  // UC05

        Route::prefix('cart')->group(function () {
            Route::get('/',            [CartController::class, 'index']);
            Route::post('/',           [CartController::class, 'store']);
            Route::put('/{itemId}',    [CartController::class, 'update']);
            Route::delete('/{itemId}', [CartController::class, 'destroy']);
            Route::delete('/',         [CartController::class, 'clear']);
        });

        Route::prefix('orders')->group(function () {
            Route::get('/',            [OrderController::class, 'index']);
            Route::post('/',           [OrderController::class, 'store']);
            Route::get('/{id}',        [OrderController::class, 'show']);
            Route::put('/{id}/cancel', [OrderController::class, 'cancel']);
        });

        // Payment: status poll + retry (authenticated)
        Route::prefix('payments')->group(function () {
            Route::post('/{gateway}/return', [PaymentController::class, 'confirmReturn'])
                 ->whereIn('gateway', ['vnpay', 'momo'])
                 ->name('payment.return.confirm');
            Route::get('/{orderId}/status',  [PaymentController::class, 'status'])
                 ->name('payment.status');
            Route::post('/{orderId}/retry',  [PaymentController::class, 'retry'])
                 ->name('payment.retry');
        });

        Route::post('/vouchers/apply', [VoucherController::class, 'apply']);
        Route::post('/reviews',        [ReviewController::class, 'store']);

        Route::prefix('notifications')->group(function () {
            Route::get('/',             [NotificationController::class, 'index']);
            Route::get('/unread-count', [NotificationController::class, 'unreadCount']);
            Route::put('/read-all',     [NotificationController::class, 'markAllAsRead']);
            Route::put('/{id}/read',    [NotificationController::class, 'markAsRead']);
        });

        // ── Admin ──────────────────────────────────────────────────────────
        Route::middleware('admin')->prefix('admin')->group(function () {
            // Dashboard
            Route::get('/dashboard/overview',    [DashboardController::class, 'overview']);
            Route::get('/dashboard/charts',      [DashboardController::class, 'charts']);
            Route::get('/dashboard/top-products',[DashboardController::class, 'topProducts']);
            Route::get('/customers',                     [DashboardController::class, 'customers']);
            Route::put('/customers/{id}/toggle-status',  [DashboardController::class, 'toggleStatus']);
            
            // Reviews Admin
            Route::get('/reviews',               [ReviewController::class, 'adminIndex']);
            Route::delete('/reviews/{id}',       [ReviewController::class, 'destroy']);

            // Products
            Route::post('/products',        [ProductController::class, 'store']);
            Route::put('/products/{id}',    [ProductController::class, 'update']);
            // POST fallback: dùng khi FE gửi multipart/form-data với _method=PUT và server báo 405
            Route::post('/products/{id}',   [ProductController::class, 'update']);
            Route::delete('/products/{id}', [ProductController::class, 'destroy']);

            // Categories
            Route::post('/categories',        [CategoryController::class, 'store']);
            Route::put('/categories/{id}',    [CategoryController::class, 'update']);
            Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

            // Orders
            Route::get('/orders',              [OrderController::class, 'adminIndex']);
            Route::get('/orders/{id}',         [OrderController::class, 'adminShow']);
            Route::put('/orders/{id}/status',  [OrderController::class, 'updateStatus']);

            // Vouchers
            Route::get('/vouchers',          [VoucherController::class, 'index']);
            Route::post('/vouchers',         [VoucherController::class, 'store']);
            Route::put('/vouchers/{id}',     [VoucherController::class, 'update']);
            Route::delete('/vouchers/{id}',  [VoucherController::class, 'destroy']);
        });
    });
});
