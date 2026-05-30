<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Bảng audit log — ghi lại TOÀN BỘ giao tiếp với payment gateway
        // Mỗi row là 1 event bất biến (chỉ có created_at, không có updated_at)
        // Dùng để debug khi xảy ra sự cố: IPN không đến, số tiền sai, chữ ký lỗi...
        Schema::create('payment_transactions', function (Blueprint $table) {
            $table->id();

            // payment_id có thể null nếu IPN gửi về nhưng không tìm thấy payment
            $table->unsignedBigInteger('payment_id')->nullable();
            $table->foreign('payment_id')
                  ->references('id')->on('payments')
                  ->nullOnDelete();

            // order_id để query nhanh không cần JOIN qua payments
            $table->unsignedBigInteger('order_id')->nullable();
            $table->foreign('order_id')
                  ->references('id')->on('orders')
                  ->nullOnDelete();

            // Gateway: 'vnpay' | 'momo'
            $table->string('gateway', 20);

            // Loại event: 'initiate' | 'ipn' | 'return' | 'refund'
            $table->string('type', 20);

            // Chiều: 'outbound' (ta gọi ra) | 'inbound' (gateway gửi vào)
            $table->string('direction', 10);

            // Dữ liệu raw — giữ nguyên không parse để debug chính xác
            $table->json('raw_request')->nullable();
            $table->json('raw_response')->nullable();

            // Kết quả verify chữ ký HMAC
            // null = outbound (không cần verify) | true = hợp lệ | false = sai
            $table->boolean('signature_valid')->nullable();

            // Mã trạng thái từ gateway (vnp_ResponseCode / resultCode MoMo)
            $table->string('status_code', 20)->nullable();

            // HTTP status code của response (200, 400, 500...)
            $table->smallInteger('http_status')->nullable();

            // IP nguồn của request inbound (để detect IPN giả mạo)
            $table->string('ip_address', 45)->nullable();

            // Ghi chú tự do: 'duplicate_skipped', 'amount_mismatch'...
            $table->text('note')->nullable();

            // Chỉ created_at — mỗi event là bất biến, không update
            $table->timestamp('created_at')->useCurrent();

            // Index để query theo payment/order nhanh
            $table->index('payment_id', 'pt_payment_id_index');
            $table->index('order_id',   'pt_order_id_index');
            $table->index(['gateway', 'type'], 'pt_gateway_type_index');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_transactions');
    }
};
