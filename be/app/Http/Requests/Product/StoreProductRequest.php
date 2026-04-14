<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Admin middleware typically handles this, but secondary check here is good practice
        return $this->user() && $this->user()->isAdmin();
    }

    public function rules(): array
    {
        return [
            'name'           => ['required', 'string', 'max:255'],
            'original_price' => ['required', 'numeric', 'min:0'],
            'price'          => ['required', 'numeric', 'min:0', 'lte:original_price'],
            'stock'          => ['required', 'integer', 'min:0'],
            'category_id'    => ['required', 'integer', 'exists:categories,id'],
            'description'    => ['nullable', 'string'],
            'material'       => ['nullable', 'string', 'max:255'],
            'images'         => ['nullable', 'array'],
            'images.*'       => ['url', 'max:2048'],
        ];
    }
}
