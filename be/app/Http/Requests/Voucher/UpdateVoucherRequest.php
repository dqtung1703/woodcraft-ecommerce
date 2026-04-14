<?php

namespace App\Http\Requests\Voucher;

use Illuminate\Foundation\Http\FormRequest;

class UpdateVoucherRequest extends FormRequest
{
    public function authorize(): bool { return $this->user() !== null; }

    public function rules(): array
    {
        return [
            'discount_type'   => ['sometimes', 'string', 'in:percent,fixed'],
            'discount_value'  => ['sometimes', 'numeric', 'min:0'],
            'min_order_value' => ['sometimes', 'numeric', 'min:0'],
            'quantity'        => ['sometimes', 'integer', 'min:1'],
            'max_discount'    => ['nullable', 'numeric', 'min:0'],
            'per_user_limit'  => ['nullable', 'integer', 'min:1'],
            'start_date'      => ['nullable', 'date'],
            'end_date'        => ['nullable', 'date', 'after_or_equal:start_date'],
            'status'          => ['sometimes', 'string', 'in:active,inactive,expired'],
        ];
    }
}
