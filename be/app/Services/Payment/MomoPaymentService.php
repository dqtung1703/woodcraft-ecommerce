<?php

// =============================================
// app/Services/Payment/MomoPaymentService.php
// =============================================
namespace App\Services\Payment;

use App\Contracts\PaymentGatewayInterface;
use App\Models\Order;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class MomoPaymentService implements PaymentGatewayInterface
{
    private const MIN_AMOUNT = 1000;
    private const MAX_AMOUNT = 50000000;

    public function __construct(
        private readonly string $partnerCode,
        private readonly string $accessKey,
        private readonly string $secretKey,
        private readonly string $endpoint,
        private readonly string $returnUrl,
        private readonly string $notifyUrl,
        private readonly int    $expireMinutes,
    ) {}

    public function getGatewayName(): string
    {
        return 'momo';
    }

    /**
     * Tạo URL thanh toán MoMo (payWithMethod)
     * requestId = UUID — idempotency key nội bộ
     * orderId   = WC{orderId}_{timestamp} — ID do ta tạo, gửi sang MoMo
     */
    public function createPayment(Order $order): string
    {
        $this->ensureConfigured();

        $requestId   = Str::uuid()->toString();
        $amount      = (int) $order->final_price;
        $momoOrderId = 'WC' . $order->id . '_' . time();
        // Encode orderId vào extraData để lấy lại khi redirect về
        $extraData   = base64_encode(json_encode(['oid' => $order->id]));

        if ($amount < self::MIN_AMOUNT || $amount > self::MAX_AMOUNT) {
            throw new \RuntimeException(
                'MoMo chỉ hỗ trợ số tiền từ ' . number_format(self::MIN_AMOUNT, 0, ',', '.') .
                'đ đến ' . number_format(self::MAX_AMOUNT, 0, ',', '.') . 'đ cho sandbox payWithMethod.'
            );
        }

        $rawHash = implode('&', [
            "accessKey={$this->accessKey}",
            "amount={$amount}",
            "extraData={$extraData}",
            "ipnUrl={$this->notifyUrl}",
            "orderId={$momoOrderId}",
            "orderInfo=Thanh toan don hang #{$order->id}",
            "partnerCode={$this->partnerCode}",
            "redirectUrl={$this->returnUrl}",
            "requestId={$requestId}",
            "requestType=payWithMethod",
        ]);

        $signature = hash_hmac('sha256', $rawHash, $this->secretKey);

        $response = Http::timeout(30)->post(rtrim($this->endpoint, '/') . '/v2/gateway/api/create', [
            'partnerCode' => $this->partnerCode,
            'requestId'   => $requestId,
            'amount'      => $amount,
            'orderId'     => $momoOrderId,
            'orderInfo'   => 'Thanh toan don hang #' . $order->id,
            'redirectUrl' => $this->returnUrl,
            'ipnUrl'      => $this->notifyUrl,
            'lang'        => 'vi',
            'extraData'   => $extraData,
            'requestType' => 'payWithMethod',
            'orderExpireTime' => $this->expireMinutes,
            'signature'   => $signature,
        ]);

        $result = $response->json();

        Log::info('MoMo: createPayment response', [
            'order_id'    => $order->id,
            'momo_order'  => $momoOrderId,
            'http_status' => $response->status(),
            'result_code' => $result['resultCode'] ?? null,
            'message'     => $result['message'] ?? null,
        ]);

        if (!$response->successful() || ($result['resultCode'] ?? -1) !== 0) {
            throw new \RuntimeException(
                'MoMo: ' . ($result['message'] ?? 'Unknown error') .
                ' (code=' . ($result['resultCode'] ?? '?') . ')'
            );
        }

        if (empty($result['payUrl'])) {
            throw new \RuntimeException('MoMo không trả về payUrl.');
        }

        // Lưu cả requestId (transaction_id nội bộ) và momoOrderId (gateway_transaction_id)
        $order->payment->update([
            'transaction_id'         => $requestId,
            'gateway_transaction_id' => $momoOrderId,
        ]);

        return $result['payUrl'];
    }

    private function ensureConfigured(): void
    {
        if (
            $this->partnerCode === ''
            || $this->accessKey === ''
            || $this->secretKey === ''
            || $this->endpoint === ''
        ) {
            throw new \RuntimeException('MoMo chưa được cấu hình. Vui lòng khai báo MOMO_PARTNER_CODE, MOMO_ACCESS_KEY, MOMO_SECRET_KEY và MOMO_ENDPOINT trong file .env.');
        }
    }

    /**
     * Verify chữ ký HMAC-SHA256 từ MoMo IPN
     * Các field phải đúng thứ tự alphabet theo MoMo spec
     */
    public function verifySignature(array $data): bool
    {
        $requiredKeys = [
            'amount',
            'extraData',
            'message',
            'orderId',
            'orderInfo',
            'orderType',
            'partnerCode',
            'payType',
            'requestId',
            'responseTime',
            'resultCode',
            'transId',
            'signature',
        ];

        foreach ($requiredKeys as $key) {
            if (!array_key_exists($key, $data)) {
                Log::warning('MoMo: missing signature field', ['field' => $key, 'data' => $data]);
                return false;
            }
        }

        $rawHash = implode('&', [
            "accessKey={$this->accessKey}",
            "amount={$data['amount']}",
            "extraData={$data['extraData']}",
            "message={$data['message']}",
            "orderId={$data['orderId']}",
            "orderInfo={$data['orderInfo']}",
            "orderType={$data['orderType']}",
            "partnerCode={$data['partnerCode']}",
            "payType={$data['payType']}",
            "requestId={$data['requestId']}",
            "responseTime={$data['responseTime']}",
            "resultCode={$data['resultCode']}",
            "transId={$data['transId']}",
        ]);

        $expected = hash_hmac('sha256', $rawHash, $this->secretKey);
        return hash_equals($expected, $data['signature'] ?? '');
    }

    /**
     * Parse kết quả IPN MoMo
     * resultCode = 0 → thành công
     * resultCode = 1006 → user cancel
     */
    public function parseIpnResult(array $data): array
    {
        $code = (int) ($data['resultCode'] ?? -1);

        return [
            'success'        => $code === 0,
            'cancelled'      => $code === 1006, // 1006 = user cancelled tại MoMo
            'transaction_id' => (string) ($data['transId'] ?? ''),
            'amount'         => (float) ($data['amount'] ?? 0),
            'message'        => $data['message'] ?? 'Unknown',
        ];
    }
}
