<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Thêm UNIQUE constraint cho order_id để đảm bảo quan hệ 1:1 giữa orders và payments
        // Nếu không có constraint này, bug code có thể tạo nhiều payment cho 1 order
        // mà không bị DB từ chối → dữ liệu sai mà không biết.
        Schema::table('payments', function (Blueprint $table) {
            $table->unique('order_id', 'payments_order_id_unique');
        });
    }

    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropUnique('payments_order_id_unique');
        });
    }
};
