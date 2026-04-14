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

            // Dispatch event via helper for listeners to pick up later (Phase 7)
            if (class_exists(\App\Events\Auth\UserRegistered::class)) {
                event(new \App\Events\Auth\UserRegistered($user));
            } else {
                event('user.registered', [$user]);
            }

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

        if (class_exists(\App\Events\Auth\UserLoggedIn::class)) {
            event(new \App\Events\Auth\UserLoggedIn($user));
        } else {
            event('user.logged_in', [$user]);
        }

        return [
            'user'  => $user,
            'token' => $token,
        ];
    }

    public function updateProfile(int $userId, UpdateProfileDTO $dto): User
    {
        $user = $this->userRepository->findById($userId);
        if (!$user) {
            // Technically impossible if called from authenticated route, but safe guard.
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

        if ($dto->newPassword !== null) {
            if (!$dto->oldPassword || !Hash::check($dto->oldPassword, $user->password_hash)) {
                throw AuthException::wrongPassword();
            }
            $dataToUpdate['password_hash'] = Hash::make($dto->newPassword);
        }

        if (!empty($dataToUpdate)) {
            return $this->userRepository->update($user, $dataToUpdate);
        }

        return $user;
    }

    public function logout(User $user): void
    {
        Log::info('User logged out', ['user_id' => $user->id]);
        $user->currentAccessToken()->delete();
    }
}
