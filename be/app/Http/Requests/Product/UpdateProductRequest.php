<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->isAdmin();
    }

    public function rules(): array
    {
        return [
            'name'           => ['sometimes', 'string', 'max:255'],
            'original_price' => ['sometimes', 'numeric', 'min:0'],
            'price'          => ['sometimes', 'numeric', 'min:0'],
            'stock'          => ['sometimes', 'integer', 'min:0'],
            'category_id'    => ['sometimes', 'integer', 'exists:categories,id'],
            'description'    => ['nullable', 'string'],
            'material'       => ['nullable', 'string', 'max:255'],
            'images'         => ['nullable', 'array'],
            'images.*'       => ['url', 'max:2048'],
        ];
    }
}
