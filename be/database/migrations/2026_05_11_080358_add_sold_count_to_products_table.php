<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->unsignedBigInteger('sold_count')->default(0)->after('stock');
        });

        // Backfill sold_count từ order_items đã hoàn thành
        DB::statement("
            UPDATE products
            SET sold_count = (
                SELECT COALESCE(SUM(oi.quantity), 0)
                FROM order_items oi
                INNER JOIN orders o ON o.id = oi.order_id
                WHERE oi.product_id = products.id
                  AND o.status IN ('delivered', 'completed')
            )
        ");
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('sold_count');
        });
    }
};
