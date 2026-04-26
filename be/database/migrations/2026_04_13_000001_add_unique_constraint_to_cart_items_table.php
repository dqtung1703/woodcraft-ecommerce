<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Migration thêm unique constraint vào bảng cart_items.
 *
 * Dùng file mới này (KHÔNG sửa file gốc) vì bảng đã được tạo trước đó.
 * Constraint này là lớp bảo vệ cuối cùng chống Race Condition trong CartService::addItem().
 */
return new class extends Migration
{
    public function up(): void
    {
        // Bước 1: Xóa các dòng duplicate trước khi add unique constraint
        // (Cần thiết nếu DB đang có data để tránh lỗi "Duplicate entry" khi migrate)
        if (DB::getDriverName() !== 'sqlite') {
            DB::statement('
                DELETE ci1 FROM cart_items ci1
                INNER JOIN cart_items ci2
                WHERE ci1.id > ci2.id
                  AND ci1.cart_id = ci2.cart_id
                  AND ci1.product_id = ci2.product_id
            ');
        }

        Schema::table('cart_items', function (Blueprint $table) {
            $table->unique(['cart_id', 'product_id'], 'cart_items_cart_product_unique');
        });
    }

    public function down(): void
    {
        Schema::table('cart_items', function (Blueprint $table) {
            $table->dropUnique('cart_items_cart_product_unique');
        });
    }
};
