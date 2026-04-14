<?php

// =============================================
// app/Http/Requests/Auth/UpdateProfileRequest.php
// =============================================
namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'name'                  => ['sometimes', 'string', 'max:255'],
            'phone'                 => ['sometimes', 'nullable', 'regex:/^[0-9]{10,11}$/'],
            'address'               => ['sometimes', 'nullable', 'string', 'max:500'],
            'old_password'          => ['required_with:password', 'string'],
            'password'              => ['sometimes', 'string', 'min:8', 'confirmed'],
            'password_confirmation' => ['required_with:password'],
        ];
    }
}