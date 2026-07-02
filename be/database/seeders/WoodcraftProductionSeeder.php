<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use RuntimeException;

/**
 * Seed dữ liệu production từ file woodcraft_ecommerce.sql.
 *
 * File SQL nguồn: database/seeders/data/woodcraft_production_seed.sql
 * Chứa toàn bộ dữ liệu thực: categories, users, products, product_images,
 * vouchers, orders, order_items, payments, reviews, carts, cart_items,
 * product_views, voucher_usage.
 *
 * ⚠️  Lưu ý: seeder này TRUNCATE toàn bộ bảng trước khi insert,
 *     nên mọi dữ liệu cũ sẽ bị xoá. Chỉ dùng khi thiết lập môi trường dev/staging.
 *
 * Chạy: php artisan db:seed --class=WoodcraftProductionSeeder
 */
class WoodcraftProductionSeeder extends Seeder
{
    public function run(): void
    {
        if (DB::connection()->getDriverName() !== 'mysql') {
            throw new RuntimeException('WoodcraftProductionSeeder yêu cầu kết nối MySQL.');
        }

        $sqlPath = database_path('seeders/data/woodcraft_production_seed.sql');

        if (! File::exists($sqlPath)) {
            throw new RuntimeException("Không tìm thấy file seed: {$sqlPath}");
        }

        $this->command->info('🔄 Bắt đầu seed dữ liệu production Woodcraft...');

        DB::statement('SET FOREIGN_KEY_CHECKS=0');

        try {
            // Xoá dữ liệu cũ theo thứ tự từ bảng con → bảng cha
            foreach ($this->tables() as $table) {
                DB::table($table)->truncate();
            }

            $this->command->info('✅ Đã xoá dữ liệu cũ.');

            // Chạy file SQL
            DB::unprepared(File::get($sqlPath));

            $this->command->info('✅ Đã import dữ liệu thành công!');
            $this->command->newLine();
            $this->command->line('  📦 Categories : ' . DB::table('categories')->count() . ' danh mục');
            $this->command->line('  🪵 Products   : ' . DB::table('products')->count() . ' sản phẩm');
            $this->command->line('  👤 Users      : ' . DB::table('users')->count() . ' tài khoản');
            $this->command->line('  📦 Orders     : ' . DB::table('orders')->count() . ' đơn hàng');
            $this->command->line('  🏷️  Vouchers   : ' . DB::table('vouchers')->count() . ' voucher');
            $this->command->line('  ⭐ Reviews    : ' . DB::table('reviews')->count() . ' đánh giá');
            $this->command->newLine();
            $this->command->line('  🔑 Tài khoản mặc định:');
            $this->command->line('     Admin    — admin@dogokhamtrai.vn / password');
            $this->command->line('     Customer — tuan.nv@gmail.com    / password');
        } finally {
            DB::statement('SET FOREIGN_KEY_CHECKS=1');
        }
    }

    /**
     * Danh sách bảng cần truncate, theo thứ tự từ bảng phụ thuộc → bảng gốc.
     *
     * @return array<int, string>
     */
    private function tables(): array
    {
        return [
            'voucher_usage',
            'payment_transactions',
            'product_views',
            'cart_items',
            'carts',
            'reviews',
            'payments',
            'order_items',
            'orders',
            'vouchers',
            'personal_access_tokens',
            'sessions',
            'product_discounts',
            'product_images',
            'products',
            'users',
            'categories',
        ];
    }
}
