<?php

namespace App\Http\Controllers\Api;

use App\DTOs\Auth\LoginDTO;
use App\DTOs\Auth\RegisterDTO;
use App\DTOs\Auth\UpdateProfileDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\UpdateProfileRequest;
use App\Http\Resources\UserResource;
use App\Http\Responses\ApiResponse;
use App\Services\AuthService;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(private readonly AuthService $authService) {}

    public function register(RegisterRequest $request)
    {
        $dto = RegisterDTO::fromRequest($request->validated());
        $result = $this->authService->register($dto);

        return ApiResponse::created([
            'user'  => new UserResource($result['user']),
            'token' => $result['token'],
        ], 'Đăng ký thành công');
    }

    public function login(LoginRequest $request)
    {
        $dto = LoginDTO::fromRequest($request->validated());
        $result = $this->authService->login($dto);

        return ApiResponse::success([
            'user'  => new UserResource($result['user']),
            'token' => $result['token'],
        ], 'Đăng nhập thành công');
    }

    public function profile(Request $request)
    {
        return ApiResponse::success(
            new UserResource($request->user()),
            'Lấy thông tin thành công'
        );
    }

    public function updateProfile(UpdateProfileRequest $request)
    {
        $dto = UpdateProfileDTO::fromRequest($request->validated());
        $user = $this->authService->updateProfile($request->user()->id, $dto);

        return ApiResponse::success(
            new UserResource($user),
            'Cập nhật thông tin thành công'
        );
    }

    public function logout(Request $request)
    {
        $this->authService->logout($request->user());

        return ApiResponse::message('Đăng xuất thành công');
    }
}
