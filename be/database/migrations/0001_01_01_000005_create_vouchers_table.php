<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vouchers', function (Blueprint $table) {
            $table->id();
            $table->string('code', 50)->unique();
            $table->string('discount_type', 20); // percent, fixed
            $table->decimal('discount_value', 12, 2);
            $table->decimal('min_order_value', 12, 2);
            $table->decimal('max_discount', 12, 2)->nullable();
            $table->integer('quantity');
            $table->integer('used_count')->default(0);
            $table->integer('per_user_limit')->nullable();
            $table->dateTime('start_date')->nullable();
            $table->dateTime('end_date')->nullable();
            $table->string('status', 20)->default('active'); // active, inactive, expired
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vouchers');
    }
};
