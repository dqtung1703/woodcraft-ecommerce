<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use RuntimeException;

class KhamTraiSeeder extends Seeder
{
    /**
     * Seed sample data for the kham trai woodcraft shop.
     */
    public function run(): void
    {
        if (DB::connection()->getDriverName() !== 'mysql') {
            throw new RuntimeException('KhamTraiSeeder requires a MySQL-compatible database.');
        }

        $sqlPath = database_path('seeders/data/seed_data_khamtrai_v2.sql');

        if (! File::exists($sqlPath)) {
            throw new RuntimeException("Seed SQL file not found: {$sqlPath}");
        }

        DB::statement('SET FOREIGN_KEY_CHECKS=0');

        try {
            foreach ($this->tables() as $table) {
                DB::table($table)->truncate();
            }

            DB::unprepared($this->normalizeSqlForCurrentSchema(File::get($sqlPath)));
        } finally {
            DB::statement('SET FOREIGN_KEY_CHECKS=1');
        }
    }

    /**
     * Tables included in the seed SQL, ordered from dependents to parents.
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
            'users',
            'product_discounts',
            'product_images',
            'products',
            'categories',
        ];
    }

    private function normalizeSqlForCurrentSchema(string $sql): string
    {
        $sql = str_replace(
            'INSERT INTO payments (id, order_id, method, status, paid_at) VALUES',
            'INSERT INTO payments (id, order_id, payment_method, payment_status, paid_at) VALUES',
            $sql
        );

        $sql = str_replace("'bank_transfer'", "'banking'", $sql);
        $sql = str_replace("'completed'", "'delivered'", $sql);
        $sql = preg_replace(
            "/('(?:cod|banking)',\\s*)'pending'/",
            "$1'unpaid'",
            $sql
        ) ?? $sql;

        return $sql;
    }
}
