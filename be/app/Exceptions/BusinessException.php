<?php

// =============================================
// app/Exceptions/BusinessException.php
// Base class cho mọi business logic exception
// =============================================
namespace App\Exceptions;

use RuntimeException;

class BusinessException extends RuntimeException
{
    public function __construct(
        string          $message,
        private int     $statusCode = 422,
        private ?string $errorCode = null,
        private mixed   $errors = null,
    ) {
        parent::__construct($message);
    }

    public function getStatusCode(): int    { return $this->statusCode; }
    public function getErrorCode(): ?string { return $this->errorCode; }
    public function getErrors(): mixed      { return $this->errors; }
}
