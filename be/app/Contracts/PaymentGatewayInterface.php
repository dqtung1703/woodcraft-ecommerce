<?php


namespace App\Contracts;

use App\Models\Order;

interface PaymentGatewayInterface
{
    /**
     * payment URL để redirect user đến trang thanh toán.
     * Lưu gateway_transaction_id vào payment record trước khi return URL.
     *
     * @throws \RuntimeException Khi gateway API thất bại
     */
    public function createPayment(Order $order): string;

    /**
     * Verify chữ ký HMAC từ data IPN hoặc return URL.
     * Dùng hash_equals() để chống timing attack.
     */
    public function verifySignature(array $data): bool;

    /**
     * Parse kết quả IPN thành format chuẩn.
     *
     * @return array{
     *   success: bool,
     *   cancelled: bool,
     *   transaction_id: string|null,
     *   amount: float,
     *   message: string
     * }
     */
    public function parseIpnResult(array $data): array;

    /**
     * Tên định danh gateway: 'vnpay' | 'momo'
     */
    public function getGatewayName(): string;
}
