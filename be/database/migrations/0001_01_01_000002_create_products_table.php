<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255);
            $table->longText('description')->nullable();
            $table->decimal('original_price', 12, 2);
            $table->decimal('price', 12, 2);
            $table->integer('stock')->default(0);
            $table->string('material', 100)->nullable();
            $table->foreignId('category_id')->constrained('categories')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
