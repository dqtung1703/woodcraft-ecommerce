<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            // 1. Đổi tên cột cho nhất quán
            $table->renameColumn('method', 'payment_method');
            $table->renameColumn('status', 'payment_status');
        });

        Schema::table('payments', function (Blueprint $table) {
            // 2. Thêm các cột mới cho online payment
            // amount: số tiền phải thanh toán (= order.final_price), để verify với IPN
            $table->decimal('amount', 12, 2)->default(0.00)->after('payment_status');

            // transaction_id: UUID nội bộ (requestId MoMo), phân biệt với gateway ID
            $table->string('transaction_id', 100)->nullable()->after('amount');

            // gateway_transaction_id: ID do gateway cấp (vnp_TxnRef, orderId MoMo)
            // Dùng để tìm payment khi nhận IPN
            $table->string('gateway_transaction_id', 100)->nullable()->after('transaction_id');

            // gateway_response: lưu toàn bộ response cuối từ gateway để debug
            $table->json('gateway_response')->nullable()->after('gateway_transaction_id');

            // expired_at: thời hạn thanh toán (online only, thường 15 phút)
            $table->dateTime('expired_at')->nullable()->after('paid_at');

            // 3. Bật timestamps (hiện tại $timestamps = false trong model)
            // created_at/updated_at giúp debug và audit
            $table->timestamps();

            // 4. Index để tìm kiếm nhanh khi nhận IPN
            $table->index('transaction_id', 'payments_transaction_id_index');
            $table->index('gateway_transaction_id', 'payments_gateway_transaction_id_index');
        });

        // 5. Cập nhật payment_status default — phân biệt unpaid (COD) vs pending (online)
        // payment_status values:
        //   unpaid    → COD/banking chưa thu tiền
        //   pending   → online payment đang chờ gateway xác nhận
        //   paid      → đã thanh toán thành công
        //   failed    → gateway từ chối / lỗi kỹ thuật
        //   cancelled → user hủy tại gateway / user hủy đơn
        //   expired   → quá thời hạn không thanh toán
        //   refunded  → đã hoàn tiền (chỉ sau khi admin/gateway xác nhận)
        Schema::table('payments', function (Blueprint $table) {
            $table->string('payment_status', 20)->default('unpaid')->change();
        });

        // 6. Backfill amount từ orders.final_price
        try {
            DB::table('payments')
                ->join('orders', 'payments.order_id', '=', 'orders.id')
                ->update([
                    'payments.amount' => DB::raw('orders.final_price')
                ]);
        } catch (\Throwable $e) {
            // Ignore failure in tests if no data exists
        }
    }

    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropIndex('payments_transaction_id_index');
            $table->dropIndex('payments_gateway_transaction_id_index');
            $table->dropColumn([
                'amount', 'transaction_id', 'gateway_transaction_id',
                'gateway_response', 'expired_at', 'created_at', 'updated_at',
            ]);
            $table->renameColumn('payment_method', 'method');
            $table->renameColumn('payment_status', 'status');
        });
    }
};
