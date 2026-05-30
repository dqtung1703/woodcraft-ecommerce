<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // Shipping snapshot — lưu tại thời điểm đặt hàng
            // Không dùng user.name/phone/address vì user có thể sửa sau khi đặt
            // Dùng default/nullable để tránh lỗi khi DB đã có dữ liệu
            $table->string('shipping_name', 100)->default('')->after('note');
            $table->string('shipping_phone', 20)->default('')->after('shipping_name');
            $table->text('shipping_address')->nullable()->after('shipping_phone');
        });

        // Backfill data từ users table cho các order có sẵn
        try {
            DB::table('orders')
                ->join('users', 'orders.user_id', '=', 'users.id')
                ->update([
                    'shipping_name'    => DB::raw('users.name'),
                    'shipping_phone'   => DB::raw('COALESCE(users.phone, "0000000000")'),
                    'shipping_address' => DB::raw('COALESCE(users.address, "N/A")'),
                ]);

            // Trường hợp user_id không còn tồn tại trong users table hoặc null
            DB::table('orders')
                ->where('shipping_name', '')
                ->update([
                    'shipping_name'    => 'Customer',
                    'shipping_phone'   => '0000000000',
                    'shipping_address' => 'N/A',
                ]);
        } catch (\Throwable $e) {
            // Bỏ qua nếu có lỗi
        }
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['shipping_name', 'shipping_phone', 'shipping_address']);
        });
    }
};
