<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->api(prepend: [
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        ]);
        
        $middleware->alias([
            'admin' => \App\Http\Middleware\IsAdmin::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        
        $exceptions->render(function (\App\Exceptions\BusinessException $e, Request $request) {
            return \App\Http\Responses\ApiResponse::error($e->getMessage(), $e->getCode(), null, $e->getErrorCode());
        });

        $exceptions->render(function (\Illuminate\Database\Eloquent\ModelNotFoundException $e, Request $request) {
            return \App\Http\Responses\ApiResponse::notFound('Không tìm thấy dữ liệu yêu cầu.');
        });

        $exceptions->render(function (\Illuminate\Auth\AuthenticationException $e, Request $request) {
            return \App\Http\Responses\ApiResponse::unauthorized('Vui lòng đăng nhập để tiếp tục.');
        });

        $exceptions->render(function (\Illuminate\Validation\ValidationException $e, Request $request) {
            return \App\Http\Responses\ApiResponse::error('Dữ liệu cung cấp không hợp lệ.', 422, $e->errors(), 'VALIDATION_ERROR');
        });

        $exceptions->render(function (\Symfony\Component\HttpKernel\Exception\HttpException $e, Request $request) {
            $message = $e->getMessage() ?: 'Lỗi hệ thống hoặc truy cập thất bại.';
            return \App\Http\Responses\ApiResponse::error($message, $e->getStatusCode());
        });

        // Tự động log và fallback nếu lên Production
        $exceptions->render(function (\Throwable $e, Request $request) {
            if (config('app.debug')) {
                return null; 
            }
            \Illuminate\Support\Facades\Log::error('System Exception', [
                'message' => $e->getMessage(),
                'trace'   => $e->getTraceAsString(),
            ]);
            return \App\Http\Responses\ApiResponse::error('Đã xảy ra sự cố từ máy chủ. Vui lòng thử lại.', 500);
        });

    })->create();
