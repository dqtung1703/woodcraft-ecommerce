<?php


namespace App\Exceptions;

class ProductException extends BusinessException
{
    public static function notFound(int $id): static
    {
        return new static("Sản phẩm #$id không tồn tại.", 404, 'PRODUCT_NOT_FOUND');
    }

    public static function outOfStock(string $name): static
    {
        return new static("Sản phẩm '$name' đã hết hàng.", 422, 'OUT_OF_STOCK');
    }

    public static function insufficientStock(string $name, int $available): static
    {
        return new static(
            "Sản phẩm '$name' chỉ còn $available sản phẩm trong kho.",
            422,
            'INSUFFICIENT_STOCK'
        );
    }
}
