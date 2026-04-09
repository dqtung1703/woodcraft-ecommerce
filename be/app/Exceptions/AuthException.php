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
}