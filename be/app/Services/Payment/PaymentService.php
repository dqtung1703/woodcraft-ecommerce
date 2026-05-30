<?php

namespace App\Services\Payment;

use App\Contracts\PaymentGatewayInterface;
use App\Models\Order;
use App\Models\Payment;
use App\Models\PaymentTransaction;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PaymentService
{
    public function __construct(
        private readonly VnpayPaymentService $vnpay,
        private readonly MomoPaymentService $momo,
    ) {}

    public function getGateway(string $method): PaymentGatewayInterface
    {
        return match ($method) {
            'vnpay' => $this->vnpay,
            'momo' => $this->momo,
            default => throw new \InvalidArgumentException("Payment gateway [{$method}] is not supported."),
        };
    }

    public function initiateOnlinePayment(Order $order): string
    {
        $payment = $order->payment;
        $gateway = $this->getGateway($payment->payment_method);

        try {
            $paymentUrl = $gateway->createPayment($order);

            $this->logTransaction(
                payment: $payment,
                order: $order,
                gateway: $gateway->getGatewayName(),
                type: 'initiate',
                direction: 'outbound',
            );

            return $paymentUrl;
        } catch (\Throwable $e) {
            Log::error('PaymentService: initiateOnlinePayment failed', [
                'order_id' => $order->id,
                'method' => $payment->payment_method,
                'error' => $e->getMessage(),
            ]);

            DB::transaction(function () use ($order) {
                $lockedOrder = Order::with(['items.product', 'payment', 'voucher'])
                    ->where('id', $order->id)
                    ->lockForUpdate()
                    ->firstOrFail();

                $lockedOrder->payment->update(['payment_status' => 'failed']);
                $lockedOrder->update(['status' => 'cancelled']);
                $this->rollbackStock($lockedOrder);
                $this->rollbackVoucher($lockedOrder);
            });

            throw $e;
        }
    }

    public function handleIpn(string $gatewayName, array $data): bool
    {
        return $this->handleGatewayCallback($gatewayName, $data, 'ipn');
    }

    public function handleReturn(string $gatewayName, array $data): bool
    {
        return $this->handleGatewayCallback($gatewayName, $data, 'return');
    }

    private function handleGatewayCallback(string $gatewayName, array $data, string $type): bool
    {
        $gateway = $this->getGateway($gatewayName);
        $signatureValid = $gateway->verifySignature($data);

        if (!$signatureValid) {
            Log::warning("PaymentService: {$type} invalid signature [{$gatewayName}]", [
                'ip' => request()->ip(),
                'data' => $data,
            ]);

            $this->logTransaction(
                payment: null,
                order: null,
                gateway: $gatewayName,
                type: $type,
                direction: 'inbound',
                rawResponse: $data,
                signatureValid: false,
                ipAddress: request()->ip(),
            );

            return false;
        }

        return DB::transaction(function () use ($gatewayName, $data, $gateway, $type) {
            $payment = $this->findPaymentByGatewayRefForUpdate($gatewayName, $data);

            if (!$payment) {
                Log::error("PaymentService: {$type} payment not found [{$gatewayName}]", ['data' => $data]);
                return false;
            }

            $order = $payment->order;

            if ($payment->payment_status !== 'pending') {
                Log::info("PaymentService: {$type} duplicate skipped [order #{$order->id}]", [
                    'current_status' => $payment->payment_status,
                ]);

                $this->logTransaction(
                    payment: $payment,
                    order: $order,
                    gateway: $gatewayName,
                    type: $type,
                    direction: 'inbound',
                    rawResponse: $data,
                    signatureValid: true,
                    ipAddress: request()->ip(),
                    note: 'duplicate_skipped',
                );

                return true;
            }

            $result = $gateway->parseIpnResult($data);
            $expectedAmount = (float) $payment->amount;
            $receivedAmount = (float) $result['amount'];

            if (abs($receivedAmount - $expectedAmount) > 1) {
                Log::error("PaymentService: {$type} amount mismatch", [
                    'order_id' => $order->id,
                    'expected' => $expectedAmount,
                    'received' => $receivedAmount,
                ]);

                $this->logTransaction(
                    payment: $payment,
                    order: $order,
                    gateway: $gatewayName,
                    type: $type,
                    direction: 'inbound',
                    rawResponse: $data,
                    signatureValid: true,
                    statusCode: (string) ($data['vnp_ResponseCode'] ?? $data['resultCode'] ?? ''),
                    ipAddress: request()->ip(),
                    note: 'amount_mismatch',
                );

                return false;
            }

            if ($result['success']) {
                $payment->update([
                    'payment_status' => 'paid',
                    'transaction_id' => $result['transaction_id'] ?? $payment->transaction_id,
                    'gateway_response' => $data,
                    'paid_at' => now(),
                ]);
                $order->update(['status' => 'processing']);
            } elseif ($result['cancelled'] ?? false) {
                $payment->update([
                    'payment_status' => 'cancelled',
                    'gateway_response' => $data,
                ]);
                $order->update(['status' => 'pending']);
            } else {
                $payment->update([
                    'payment_status' => 'failed',
                    'gateway_response' => $data,
                ]);
                $order->update(['status' => 'pending']);
            }

            $this->logTransaction(
                payment: $payment,
                order: $order,
                gateway: $gatewayName,
                type: $type,
                direction: 'inbound',
                rawResponse: $data,
                signatureValid: true,
                statusCode: (string) ($data['vnp_ResponseCode'] ?? $data['resultCode'] ?? ''),
                ipAddress: request()->ip(),
            );

            return true;
        });
    }

    public function retryPayment(Order $order): string
    {
        $retryContext = DB::transaction(function () use ($order) {
            $lockedOrder = Order::with('payment')
                ->where('id', $order->id)
                ->lockForUpdate()
                ->firstOrFail();

            $payment = $lockedOrder->payment;

            if ($lockedOrder->status !== 'pending') {
                throw new \RuntimeException('Cannot retry order in status: ' . $lockedOrder->status);
            }

            if (!$payment || !$payment->canRetry()) {
                throw new \RuntimeException(
                    'Cannot retry payment in status: ' . ($payment?->payment_status ?? 'missing')
                );
            }

            $oldState = [
                'payment_status' => $payment->payment_status,
                'transaction_id' => $payment->transaction_id,
                'gateway_transaction_id' => $payment->gateway_transaction_id,
                'gateway_response' => $payment->gateway_response,
                'expired_at' => $payment->expired_at,
            ];

            $payment->update([
                'payment_status' => 'pending',
                'transaction_id' => null,
                'gateway_transaction_id' => null,
                'gateway_response' => null,
                'expired_at' => now()->addMinutes(
                    config('payment.' . $payment->payment_method . '.expire_minutes', 15)
                ),
            ]);

            return [
                'order' => $lockedOrder->fresh(['payment']),
                'payment_id' => $payment->id,
                'method' => $payment->payment_method,
                'old_state' => $oldState,
            ];
        });

        $payment = Payment::findOrFail($retryContext['payment_id']);
        $gateway = $this->getGateway($retryContext['method']);

        try {
            $paymentUrl = $gateway->createPayment($retryContext['order']);

            $this->logTransaction(
                payment: $payment,
                order: $retryContext['order'],
                gateway: $gateway->getGatewayName(),
                type: 'initiate',
                direction: 'outbound',
                note: 'retry',
            );

            return $paymentUrl;
        } catch (\Throwable $e) {
            Log::error('PaymentService: retryPayment failed', [
                'order_id' => $retryContext['order']->id,
                'method' => $retryContext['method'],
                'error' => $e->getMessage(),
            ]);

            Payment::whereKey($retryContext['payment_id'])->update($retryContext['old_state']);

            throw $e;
        }
    }

    private function findPaymentByGatewayRefForUpdate(string $gateway, array $data): ?Payment
    {
        $ref = match ($gateway) {
            'vnpay' => $data['vnp_TxnRef'] ?? null,
            'momo' => $data['orderId'] ?? null,
            default => null,
        };

        if (!$ref) {
            return null;
        }

        return Payment::with(['order.items.product', 'order.voucher'])
            ->where('gateway_transaction_id', $ref)
            ->lockForUpdate()
            ->first();
    }

    private function rollbackStock(Order $order): void
    {
        foreach ($order->items as $item) {
            DB::table('products')
                ->where('id', $item->product_id)
                ->increment('stock', $item->quantity);
        }
    }

    private function rollbackVoucher(Order $order): void
    {
        if (!$order->voucher_id) {
            return;
        }

        \App\Models\VoucherUsage::where('order_id', $order->id)->delete();
        \App\Models\Voucher::where('id', $order->voucher_id)->decrement('used_count');
    }

    private function logTransaction(
        ?Payment $payment,
        ?Order $order,
        string $gateway,
        string $type,
        string $direction,
        array $rawRequest = [],
        array $rawResponse = [],
        ?bool $signatureValid = null,
        ?string $statusCode = null,
        ?int $httpStatus = null,
        ?string $ipAddress = null,
        ?string $note = null,
    ): void {
        try {
            PaymentTransaction::create([
                'payment_id' => $payment?->id,
                'order_id' => $order?->id,
                'gateway' => $gateway,
                'type' => $type,
                'direction' => $direction,
                'raw_request' => $rawRequest ?: null,
                'raw_response' => $rawResponse ?: null,
                'signature_valid' => $signatureValid,
                'status_code' => $statusCode,
                'http_status' => $httpStatus,
                'ip_address' => $ipAddress,
                'note' => $note,
            ]);
        } catch (\Throwable $e) {
            Log::error('PaymentService: logTransaction failed', ['error' => $e->getMessage()]);
        }
    }
}
