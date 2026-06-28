<?php


namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\Order;
use App\Services\Payment\PaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

final class PaymentController extends Controller
{
    public function __construct(
        private readonly PaymentService $paymentService,
    ) {}

    // ─────────────────────────────────────────────────────────────────────────
    // IPN — Public endpoints (không có auth, verify bằng HMAC chữ ký)
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * GET|POST /api/v1/payments/vnpay/ipn
     * VNPay gọi server-to-server sau khi có kết quả giao dịch.
     * Route::match(['get','post'], ...) vì config VNPay sandbox có thể là GET hoặc POST.
     */
    public function vnpayIpn(Request $request): JsonResponse
    {
        Log::info('VNPay IPN received', [
            'ip'   => $request->ip(),
            'data' => $request->all(),
        ]);

        try {
            $success = $this->paymentService->handleIpn('vnpay', $request->all());

            // VNPay yêu cầu response theo format này
            return response()->json([
                'RspCode' => $success ? '00' : '99',
                'Message' => $success ? 'Confirm Success' : 'Confirm Fail',
            ]);

        } catch (\Throwable $e) {
            Log::error('VNPay IPN exception', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'RspCode' => '99',
                'Message' => 'Internal Server Error',
            ]);
        }
    }

    /**
     * POST /api/v1/payments/momo/ipn
     * MoMo gọi server-to-server sau khi có kết quả giao dịch.
     */
    public function momoIpn(Request $request): JsonResponse
    {
        Log::info('MoMo IPN received', [
            'ip'   => $request->ip(),
            'data' => $request->all(),
        ]);

        try {
            $success = $this->paymentService->handleIpn('momo', $request->all());

            if ($success) {
                return response()->json(null, 204);
            }

            return response()->json(['message' => 'Confirm Fail'], 400);

        } catch (\Throwable $e) {
            Log::error('MoMo IPN exception', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json(['message' => 'Internal Server Error'], 500);
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Authenticated endpoints
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * GET /api/v1/payments/{orderId}/status
     * Frontend poll sau khi redirect về từ gateway.
     * KHÔNG tin vào query params từ gateway — luôn đọc từ DB.
     */
    public function status(Request $request, int $orderId): JsonResponse
    {
        $order = Order::with('payment')
            ->where('id', $orderId)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        return ApiResponse::success([
            'order_id'       => $order->id,
            'order_status'   => $order->status,
            'payment_status' => $order->payment?->payment_status,
            'payment_method' => $order->payment?->payment_method,
            'paid_at'        => $order->payment?->paid_at?->toISOString(),
        ]);
    }

    /**
     * POST /api/v1/payments/{gateway}/return
     * Frontend gọi sau khi gateway redirect về. Backend vẫn verify chữ ký HMAC
     * trước khi cập nhật DB, dùng làm fallback khi IPN sandbox không gọi tới.
     */
    public function confirmReturn(Request $request, string $gateway): JsonResponse
    {
        Log::info('Payment return confirm received', [
            'gateway' => $gateway,
            'ip' => $request->ip(),
            'data' => $request->all(),
        ]);

        if (!in_array($gateway, ['vnpay', 'momo'], true)) {
            return ApiResponse::error('Payment gateway không hợp lệ.', 422);
        }

        try {
            $success = $this->paymentService->handleReturn($gateway, $request->all());

            if (!$success) {
                return ApiResponse::error('Không thể xác nhận kết quả thanh toán.', 422);
            }

            return ApiResponse::success(null, 'Xác nhận kết quả thanh toán thành công.');
        } catch (\Throwable $e) {
            Log::error('Payment return confirm exception', [
                'gateway' => $gateway,
                'error' => $e->getMessage(),
            ]);

            return ApiResponse::serverError('Không thể xác nhận kết quả thanh toán.');
        }
    }

    /**
     * POST /api/v1/payments/{orderId}/retry
     * Retry khi payment_status IN (failed, cancelled, expired) và order.status=pending.
     */
    public function retry(Request $request, int $orderId): JsonResponse
    {
        $order = Order::with('payment')
            ->where('id', $orderId)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $paymentUrl = $this->paymentService->retryPayment($order);

        return ApiResponse::success(
            ['payment_url' => $paymentUrl],
            'Tạo link thanh toán mới thành công.'
        );
    }
}
