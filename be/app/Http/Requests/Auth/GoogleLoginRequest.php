<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class GoogleLoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'credential' => ['required', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'credential.required' => 'Google credential là bắt buộc.',
            'credential.string'   => 'Google credential không hợp lệ.',
        ];
    }
}
