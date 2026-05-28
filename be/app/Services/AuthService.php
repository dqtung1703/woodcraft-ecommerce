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
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

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
                'password_hash' => $dto->password, // Mutator sẽ tự hash
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

        // Guard: user không tồn tại, hoặc tài khoản Google-only (password_hash = null),
        // hoặc mật khẩu sai → cùng trả một thông báo để không lộ thông tin
        if (!$user || !$user->password_hash || !Hash::check($dto->password, $user->password_hash)) {
            throw AuthException::invalidCredentials();
        }

        if (!$user->is_active) {
            throw AuthException::accountLocked();
        }

        // Chỉ cho phép 1 session trên 1 thiết bị → xóa các token cũ
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
     * Yêu cầu xác minh mật khẩu cũ trước khi đổi.
     * Guard: tài khoản Google-only (password_hash = null) không được đổi mật khẩu theo flow này.
     */
    public function changePassword(User $user, string $oldPassword, string $newPassword): void
    {
        // Guard: tài khoản Google-only chưa có mật khẩu
        if (!$user->password_hash) {
            throw AuthException::cannotChangePassword();
        }

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

    // ─── Google OAuth ───────────────────────────────────────────────────────

    /**
     * Verify Google ID Token bằng cách gọi Google tokeninfo endpoint.
     * Không dùng package nặng — chỉ cần HTTP request đơn giản.
     *
     * @param  string $credential  Google ID Token (JWT) từ frontend
     * @return array               Payload đã được verify
     * @throws ValidationException Khi token không hợp lệ
     */
    private function verifyGoogleCredential(string $credential): array
    {
        $clientId = config('services.google.client_id');

        if (!$clientId) {
            Log::error('GOOGLE_CLIENT_ID chưa được cấu hình trong .env');
            throw ValidationException::withMessages([
                'credential' => ['Hệ thống chưa cấu hình Google Client ID.'],
            ]);
        }

        // Gọi Google tokeninfo API để verify token
        $response = Http::timeout(5)->get('https://oauth2.googleapis.com/tokeninfo', [
            'id_token' => $credential,
        ]);

        if (!$response->successful()) {
            Log::warning('Google tokeninfo trả về lỗi', [
                'status' => $response->status(),
                'body'   => $response->body(),
            ]);
            throw ValidationException::withMessages([
                'credential' => ['Google token không hợp lệ hoặc đã hết hạn.'],
            ]);
        }

        $payload = $response->json();

        // Token phải thuộc đúng Google OAuth Client của ứng dụng này
        if (($payload['aud'] ?? null) !== $clientId) {
            Log::warning('Google token aud không khớp', [
                'expected' => $clientId,
                'received' => $payload['aud'] ?? null,
            ]);
            throw ValidationException::withMessages([
                'credential' => ['Google token không thuộc ứng dụng này.'],
            ]);
        }

        // Issuer phải là Google
        $validIssuers = ['https://accounts.google.com', 'accounts.google.com'];
        if (!in_array($payload['iss'] ?? null, $validIssuers, true)) {
            throw ValidationException::withMessages([
                'credential' => ['Nguồn phát hành Google token không hợp lệ.'],
            ]);
        }

        // Bắt buộc phải có google_id (sub) và email
        if (empty($payload['sub']) || empty($payload['email'])) {
            throw ValidationException::withMessages([
                'credential' => ['Google token thiếu thông tin tài khoản.'],
            ]);
        }

        // Email Google phải được xác thực
        if (($payload['email_verified'] ?? 'false') !== 'true') {
            throw ValidationException::withMessages([
                'credential' => ['Email Google chưa được xác thực. Vui lòng xác thực email Google trước.'],
            ]);
        }

        return $payload;
    }

    /**
     * Đăng nhập hoặc đăng ký bằng Google ID Token.
     * Xử lý 3 trường hợp:
     *   TH1: User đã liên kết Google (google_id tồn tại) → đăng nhập
     *   TH2: Email đã tồn tại nhưng chưa liên kết Google → liên kết và đăng nhập
     *   TH3: User hoàn toàn mới → tạo tài khoản và đăng nhập
     *
     * @param  string $credential  Google ID Token từ frontend
     * @return array               ['user' => User, 'token' => string]
     */
    public function loginWithGoogle(string $credential): array
    {
        $payload = $this->verifyGoogleCredential($credential);

        $googleId = $payload['sub'];           // Google user ID duy nhất
        $email    = $payload['email'];
        $name     = $payload['name'] ?? explode('@', $email)[0];
        $avatar   = $payload['picture'] ?? null;

        return DB::transaction(function () use ($googleId, $email, $name, $avatar) {

            // ── TH1: User đã liên kết Google trước đó ──────────────────────
            $user = $this->userRepository->findByGoogleId($googleId);

            if ($user) {
                if (!$user->is_active) {
                    throw AuthException::accountLocked();
                }

                // Cập nhật avatar mới nhất từ Google (có thể user đổi ảnh)
                $this->userRepository->update($user, [
                    'avatar' => $avatar,
                ]);

                $user = $user->fresh();

                Log::info('Google login: existing user', ['user_id' => $user->id]);

                return [
                    'user'  => $user,
                    'token' => $user->createToken('google_auth')->plainTextToken,
                ];
            }

            // ── TH2: Email đã tồn tại, liên kết Google vào tài khoản cũ ────
            $user = $this->userRepository->findByEmail($email);

            if ($user) {
                if (!$user->is_active) {
                    throw AuthException::accountLocked();
                }

                $this->userRepository->update($user, [
                    'google_id'         => $googleId,
                    'avatar'            => $avatar,
                    'google_linked_at'  => now(),
                    // Đánh dấu email đã xác thực nếu trước đó chưa có
                    'email_verified_at' => $user->email_verified_at ?? now(),
                    // Không đổi role (giữ nguyên admin/customer)
                    // Không xóa password_hash (vẫn có thể đăng nhập bằng email/password)
                    // Không đổi auth_provider (tài khoản gốc là email)
                ]);

                Log::info('Google login: linked to existing email user', [
                    'user_id' => $user->id,
                    'email'   => $email,
                ]);

                $user = $user->fresh();

                return [
                    'user'  => $user,
                    'token' => $user->createToken('google_auth')->plainTextToken,
                ];
            }

            // ── TH3: User hoàn toàn mới ────────────────────────────────────
            $user = $this->userRepository->create([
                'name'              => $name,
                'email'             => $email,
                'google_id'         => $googleId,
                'avatar'            => $avatar,
                'auth_provider'     => 'google',
                'google_linked_at'  => now(),
                'email_verified_at' => now(),  // Email Google đã xác thực
                'role'              => 'customer', // Không bao giờ tự tạo admin từ Google
                'password_hash'     => null,       // Google-only: không có mật khẩu
            ]);

            // Tạo giỏ hàng cho user mới (giống flow đăng ký thường)
            $user->cart()->firstOrCreate([]);

            Log::info('Google login: new user created', [
                'user_id' => $user->id,
                'email'   => $email,
            ]);

            return [
                'user'  => $user,
                'token' => $user->createToken('google_auth')->plainTextToken,
            ];
        });
    }
}
