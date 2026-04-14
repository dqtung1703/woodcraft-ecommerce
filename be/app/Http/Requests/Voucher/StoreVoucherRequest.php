<?php

namespace App\Http\Requests\Voucher;

use Illuminate\Foundation\Http\FormRequest;

class StoreVoucherRequest extends FormRequest
{
    public function authorize(): bool { return $this->user() !== null; }

    public function rules(): array
    {
        return [
            'code'            => ['required', 'string', 'max:50', 'alpha_dash'],
            'discount_type'   => ['required', 'string', 'in:percent,fixed'],
            'discount_value'  => ['required', 'numeric', 'min:0'],
            'min_order_value' => ['required', 'numeric', 'min:0'],
            'quantity'        => ['required', 'integer', 'min:1'],
            'max_discount'    => ['nullable', 'numeric', 'min:0'],
            'per_user_limit'  => ['nullable', 'integer', 'min:1'],
            'start_date'      => ['nullable', 'date'],
            'end_date'        => ['nullable', 'date', 'after_or_equal:start_date'],
        ];
    }
}
