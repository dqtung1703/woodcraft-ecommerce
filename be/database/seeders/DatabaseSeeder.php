<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     *
     * Dùng WoodcraftProductionSeeder để import toàn bộ dữ liệu thực từ
     * file woodcraft_ecommerce.sql (đã được trích xuất vào woodcraft_production_seed.sql).
     *
     * Lệnh chạy: php artisan migrate --seed
     *         hoặc: php artisan db:seed
     */
    public function run(): void
    {
        $this->call(WoodcraftProductionSeeder::class);
    }
}
