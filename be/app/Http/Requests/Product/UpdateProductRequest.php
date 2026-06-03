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
            'name'            => ['sometimes', 'string', 'max:255'],
            'original_price'  => ['sometimes', 'numeric', 'min:0'],
            'cost_price'      => ['sometimes', 'numeric', 'min:0'],
            'price'           => ['sometimes', 'numeric', 'min:0'],
            'stock'           => ['sometimes', 'integer', 'min:0'],
            'category_id'     => ['sometimes', 'integer', 'exists:categories,id'],
            'description'     => ['nullable', 'string'],
            'material'        => ['nullable', 'string', 'max:255'],
            // Ảnh mới upload
            'images'          => ['nullable', 'array'],
            'images.*'        => ['image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            // Ảnh cũ muốn giữ lại
            'keep_images'     => ['nullable', 'array'],
            'keep_images.*'   => ['string', 'url'],
            // Tín hiệu replace — khi =1 thì xử lý ảnh; khi vắng mặt thì giữ nguyên
            'replace_images'  => ['sometimes', 'boolean'],
        ];
    }

    /**
     * Validate tổng ảnh (cũ giữ lại + mới upload) không vượt quá 5
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($v) {
            $keepCount = count($this->input('keep_images', []));
            $newCount  = count($this->file('images', []));

            if ($keepCount + $newCount > 5) {
                $v->errors()->add(
                    'images',
                    "Tổng số ảnh không được vượt quá 5 (hiện tại: {$keepCount} ảnh cũ + {$newCount} ảnh mới)."
                );
            }
        });
    }
}
