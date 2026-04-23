<?php

// =============================================
// app/Http/Requests/Auth/ChangePasswordRequest.php
// =============================================
namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class ChangePasswordRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'old_password'          => ['required', 'string'],
            'password'              => ['required', 'string', 'min:8', 'confirmed'],
            'password_confirmation' => ['required', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'old_password.required'          => 'Vui lòng nhập mật khẩu hiện tại.',
            'password.required'              => 'Vui lòng nhập mật khẩu mới.',
            'password.min'                   => 'Mật khẩu mới phải có ít nhất 8 ký tự.',
            'password.confirmed'             => 'Xác nhận mật khẩu không khớp.',
            'password_confirmation.required' => 'Vui lòng xác nhận mật khẩu mới.',
        ];
    }
}
