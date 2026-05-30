<?php

// =============================================
// app/Services/Payment/VnpayPaymentService.php
// =============================================
namespace App\Services\Payment;

use App\Contracts\PaymentGatewayInterface;
use App\Models\Order;
use Illuminate\Support\Facades\Log;

class VnpayPaymentService implements PaymentGatewayInterface
{
    public function __construct(
        private readonly string $tmnCode,
        private readonly string $hashSecret,
        private readonly string $payUrl,
        private readonly string $returnUrl,
        private readonly int    $expireMinutes,
    ) {}

    public function getGatewayName(): string
    {
        return 'vnpay';
    }

    /**
     * Tạo URL thanh toán VNPay theo chuẩn VNPay 2.1.0
     * BẮT BUỘC: ksort() các param trước khi hash
     */
    public function createPayment(Order $order): string
    {
        $this->ensureConfigured();

        // vnp_TxnRef = {orderId}_{timestamp} để có thể extract orderId từ return URL
        $txnRef = $order->id . '_' . time();
        $vnpayNow = now('Asia/Ho_Chi_Minh');

        $params = [
            'vnp_Version'    => '2.1.0',
            'vnp_Command'    => 'pay',
            'vnp_TmnCode'    => $this->tmnCode,
            'vnp_Amount'     => (int) ($order->final_price * 100), // VNPay tính theo VNĐ * 100
            'vnp_CurrCode'   => 'VND',
            'vnp_TxnRef'     => $txnRef,
            'vnp_OrderInfo'  => 'Thanh toan don hang #' . $order->id,
            'vnp_OrderType'  => 'other',
            'vnp_Locale'     => 'vn',
            'vnp_ReturnUrl'  => $this->returnUrl,
            'vnp_IpAddr'     => request()->ip() ?: '127.0.0.1',
            'vnp_CreateDate' => $vnpayNow->format('YmdHis'),
            'vnp_ExpireDate' => $vnpayNow->copy()->addMinutes($this->expireMinutes)->format('YmdHis'),
        ];

        // BẮT BUỘC: sort theo key trước khi build query string
        ksort($params);
        $queryString = http_build_query($params);
        $signature   = hash_hmac('sha512', $queryString, $this->hashSecret);

        // Lưu txnRef vào payment record để tìm lại khi nhận IPN
        $order->payment->update(['gateway_transaction_id' => $txnRef]);

        Log::info('VNPay: createPayment', [
            'order_id' => $order->id,
            'txn_ref'  => $txnRef,
            'amount'   => $order->final_price,
            'create_date' => $params['vnp_CreateDate'],
            'expire_date' => $params['vnp_ExpireDate'],
        ]);

        return $this->payUrl . '?' . $queryString . '&vnp_SecureHash=' . $signature;
    }

    private function ensureConfigured(): void
    {
        if ($this->tmnCode === '' || $this->hashSecret === '') {
            throw new \RuntimeException('VNPay chưa được cấu hình. Vui lòng khai báo VNPAY_TMN_CODE và VNPAY_HASH_SECRET trong file .env.');
        }
    }

    /**
     * Verify chữ ký HMAC-SHA512 từ VNPay
     * Phải loại bỏ vnp_SecureHash và vnp_SecureHashType trước khi tính lại
     */
    public function verifySignature(array $data): bool
    {
        $received = $data['vnp_SecureHash'] ?? '';

        if (empty($received)) {
            return false;
        }

        // Loại bỏ các field không tham gia ký, sau đó sort
        $params = collect($data)
            ->except(['vnp_SecureHash', 'vnp_SecureHashType'])
            ->filter(fn($v) => $v !== '' && $v !== null)
            ->sortKeys()
            ->toArray();

        $expected = hash_hmac('sha512', http_build_query($params), $this->hashSecret);

        // hash_equals để chống timing attack
        return hash_equals($expected, $received);
    }

    /**
     * Parse kết quả IPN VNPay
     * vnp_ResponseCode = '00' → thành công
     * vnp_ResponseCode = '24' → user hủy
     * Các code khác → thất bại kỹ thuật
     */
    public function parseIpnResult(array $data): array
    {
        $code = $data['vnp_ResponseCode'] ?? '';

        return [
            'success'        => $code === '00',
            'cancelled'      => $code === '24', // 24 = user cancelled tại VNPay
            'transaction_id' => $data['vnp_TransactionNo'] ?? null,
            'amount'         => isset($data['vnp_Amount'])
                ? (float) $data['vnp_Amount'] / 100  // Convert lại từ VNĐ * 100
                : 0.0,
            'message'        => $data['vnp_Message'] ?? 'Unknown',
        ];
    }
}
