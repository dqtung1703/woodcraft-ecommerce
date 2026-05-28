<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Google OAuth fields
            $table->string('google_id', 100)->nullable()->unique()->after('email');
            $table->string('avatar', 500)->nullable()->after('google_id');
            $table->string('auth_provider', 20)->default('email')->after('avatar');
            $table->timestamp('google_linked_at')->nullable()->after('auth_provider');

            // email_verified_at (nếu chưa có trong bảng users)
            if (!Schema::hasColumn('users', 'email_verified_at')) {
                $table->timestamp('email_verified_at')->nullable()->after('google_linked_at');
            }

            // Cho phép password_hash = null (tài khoản Google-only không có mật khẩu)
            $table->string('password_hash', 255)->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Bỏ unique index trước khi dropColumn
            $table->dropUnique(['google_id']);

            $table->dropColumn([
                'google_id',
                'avatar',
                'auth_provider',
                'google_linked_at',
            ]);

            if (Schema::hasColumn('users', 'email_verified_at')) {
                $table->dropColumn('email_verified_at');
            }

            // Khôi phục NOT NULL (cẩn thận nếu đã có user Google với password_hash = null)
            $table->string('password_hash', 255)->nullable(false)->change();
        });
    }
};
