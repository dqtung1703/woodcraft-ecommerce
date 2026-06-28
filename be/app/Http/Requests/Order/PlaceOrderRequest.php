<?php


namespace App\Http\Requests\Order;

use Illuminate\Foundation\Http\FormRequest;

class PlaceOrderRequest extends FormRequest
{
    public function authorize(): bool { return auth()->check(); }

    public function rules(): array
    {
        return [
            'payment_method'   => ['required', 'in:cod,banking,vnpay,momo'],
            'voucher_code'     => ['nullable', 'string', 'max:50'],
            'note'             => ['nullable', 'string', 'max:500'],
            // Shipping snapshot — bắt buộc để lưu lại tại thời điểm đặt hàng
            'shipping_name'    => ['required', 'string', 'max:100'],
            'shipping_phone'   => ['required', 'string', 'max:20'],
            'shipping_address' => ['required', 'string', 'max:500'],
        ];
    }
}
