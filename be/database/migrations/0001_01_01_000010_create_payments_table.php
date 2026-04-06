<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->string('method', 20); // cod, vnpay, momo, banking
            $table->string('status', 20)->default('pending'); // pending, paid, failed, refunded
            $table->dateTime('paid_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
