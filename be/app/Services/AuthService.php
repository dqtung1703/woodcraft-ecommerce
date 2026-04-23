<?php

namespace App\Services;

use App\DTOs\Auth\LoginDTO;
use App\DTOs\Auth\RegisterDTO;
use App\DTOs\Auth\UpdateProfileDTO;
use App\Exceptions\AuthException;
use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class AuthService
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository
    ) {}

    public function register(RegisterDTO $dto): array
    {
        return DB::transaction(function () use ($dto) {
            $user = $this->userRepository->create([
                'name'          => $dto->name,
                'email'         => $dto->email,
                'password_hash' => Hash::make($dto->password), // Password cast to hashed later but we make it explicit
                'role'          => 'customer',
                'phone'         => $dto->phone,
                'address'       => $dto->address,
            ]);

            // Tự động tạo giỏ hàng cho user
            $user->cart()->create();

            $token = $user->createToken('auth_token')->plainTextToken;

            Log::info('User registered successfully', ['user_id' => $user->id]);

            // Dispatch event
            event(new \App\Events\Auth\UserRegistered($user));

            return [
                'user'  => $user,
                'token' => $token,
            ];
        });
    }

    public function login(LoginDTO $dto): array
    {
        $user = $this->userRepository->findByEmail($dto->email);

        if (!$user || !Hash::check($dto->password, $user->password_hash)) {
            throw AuthException::invalidCredentials();
        }

        // Chỉ cho phép 1 session trên 1 thiết bị -> xóa các token cũ
        $user->tokens()->delete();

        $token = $user->createToken('auth_token')->plainTextToken;

        Log::info('User logged in', ['user_id' => $user->id]);

        event(new \App\Events\Auth\UserLoggedIn($user));

        return [
            'user'  => $user,
            'token' => $token,
        ];
    }

    /**
     * UC04 — Cập nhật hồ sơ cá nhân (tên, sđt, địa chỉ)
     * Không xử lý đổi mật khẩu — dùng changePassword() riêng cho UC05.
     */
    public function updateProfile(int $userId, UpdateProfileDTO $dto): User
    {
        $user = $this->userRepository->findById($userId);
        if (!$user) {
            throw new \Illuminate\Database\Eloquent\ModelNotFoundException();
        }

        $dataToUpdate = [];

        if ($dto->name !== null) {
            $dataToUpdate['name'] = $dto->name;
        }

        if ($dto->phone !== null) {
            $dataToUpdate['phone'] = $dto->phone;
        }

        if ($dto->address !== null) {
            $dataToUpdate['address'] = $dto->address;
        }

        if (!empty($dataToUpdate)) {
            return $this->userRepository->update($user, $dataToUpdate);
        }

        return $user;
    }

    /**
     * UC05 — Đổi mật khẩu (endpoint riêng: PUT /profile/password)
     * Yêu cầu xác mịnh mật khẩu cũ trước khi đổi.
     */
    public function changePassword(User $user, string $oldPassword, string $newPassword): void
    {
        if (!Hash::check($oldPassword, $user->password_hash)) {
            throw AuthException::wrongPassword();
        }

        $this->userRepository->update($user, [
            'password_hash' => Hash::make($newPassword),
        ]);

        Log::info('User changed password', ['user_id' => $user->id]);
    }

    public function logout(User $user): void
    {
        Log::info('User logged out', ['user_id' => $user->id]);
        $user->currentAccessToken()->delete();
    }
}
