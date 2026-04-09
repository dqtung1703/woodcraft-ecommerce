<?php

// =============================================
// app/DTOs/Auth/UpdateProfileDTO.php
// =============================================
namespace App\DTOs\Auth;

final readonly class UpdateProfileDTO
{
    public function __construct(
        public ?string $name = null,
        public ?string $phone = null,
        public ?string $address = null,
        public ?string $newPassword = null,
        public ?string $oldPassword = null,
    ) {}

    public static function fromRequest(array $data): self
    {
        return new self(
            name:        $data['name'] ?? null,
            phone:       $data['phone'] ?? null,
            address:     $data['address'] ?? null,
            newPassword: $data['password'] ?? null,
            oldPassword: $data['old_password'] ?? null,
        );
    }
}