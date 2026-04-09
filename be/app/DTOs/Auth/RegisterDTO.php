<?php

// =============================================
// app/DTOs/Auth/RegisterDTO.php
// =============================================
namespace App\DTOs\Auth;

final readonly class RegisterDTO
{
    public function __construct(
        public string  $name,
        public string  $email,
        public string  $password,
        public ?string $phone = null,
        public ?string $address = null,
    ) {}

    public static function fromRequest(array $data): self
    {
        return new self(
            name:     $data['name'],
            email:    $data['email'],
            password: $data['password'],
            phone:    $data['phone'] ?? null,
            address:  $data['address'] ?? null,
        );
    }
}