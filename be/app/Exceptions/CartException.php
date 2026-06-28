<?php


namespace App\Exceptions;

class CartException extends BusinessException
{
    public static function empty(): static
    {
        return new static('Giỏ hàng trống.', 422, 'CART_EMPTY');
    }

    public static function itemNotFound(): static
    {
        return new static('Sản phẩm không có trong giỏ hàng.', 404, 'CART_ITEM_NOT_FOUND');
    }
}
