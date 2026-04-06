<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_views', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable(); // nullable: guest cũng view được
            $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->dateTime('viewed_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_views');
    }
};
