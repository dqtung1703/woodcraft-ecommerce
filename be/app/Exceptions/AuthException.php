<?php

// =============================================
// app/Exceptions/AuthException.php
// =============================================
namespace App\Exceptions;

class AuthException extends BusinessException
{
    public static function invalidCredentials(): static
    {
        return new static('Email hoặc mật khẩu không đúng.', 401, 'INVALID_CREDENTIALS');
    }

    public static function emailAlreadyExists(): static
    {
        return new static('Email này đã được sử dụng.', 422, 'EMAIL_EXISTS');
    }

    public static function wrongPassword(): static
    {
        return new static('Mật khẩu cũ không đúng.', 422, 'WRONG_PASSWORD');
    }

    public static function cannotChangePassword(): static
    {
        return new static('Tài khoản Google chưa thiết lập mật khẩu. Vui lòng sử dụng tài khoản Google để đăng nhập.', 422, 'NO_PASSWORD');
    }

    public static function accountLocked(string $adminEmail = 'admin@woodcraft.com'): static
    {
        return new static("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ với admin qua email ({$adminEmail}) để được hỗ trợ mở khóa.", 403, 'ACCOUNT_LOCKED');
    }
}