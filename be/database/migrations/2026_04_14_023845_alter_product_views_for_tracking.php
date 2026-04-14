<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('product_views', function (Blueprint $table) {
            $table->string('ip_hash', 64)->nullable()->after('user_id');
            
            // Add unique indexes for upsert deduplication
            $table->unique(['user_id', 'product_id'], 'unique_user_product_view');
            $table->unique(['ip_hash', 'product_id'], 'unique_ip_product_view');
        });
    }

    public function down(): void
    {
        Schema::table('product_views', function (Blueprint $table) {
            $table->dropUnique('unique_user_product_view');
            $table->dropUnique('unique_ip_product_view');
            $table->dropColumn('ip_hash');
        });
    }
};
