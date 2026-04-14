<?php

// =============================================
// app/Http/Requests/Order/PlaceOrderRequest.php
// =============================================
namespace App\Http\Requests\Order;

use Illuminate\Foundation\Http\FormRequest;

class PlaceOrderRequest extends FormRequest
{
    public function authorize(): bool { return auth()->check(); }

    public function rules(): array
    {
        return [
            'payment_method' => ['required', 'in:cod,banking'],
            'voucher_code'   => ['nullable', 'string', 'max:50'],
            'note'           => ['nullable', 'string', 'max:500'],
        ];
    }
}
