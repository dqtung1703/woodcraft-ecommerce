<?php


namespace App\Exceptions;

class ReviewException extends BusinessException
{
    public static function notPurchased(): static
    {
        return new static(
            'Bạn cần mua và nhận được sản phẩm này trước khi đánh giá.',
            403,
            'REVIEW_NOT_PURCHASED'
        );
    }

    public static function alreadyReviewed(): static
    {
        return new static('Bạn đã đánh giá sản phẩm này rồi.', 422, 'ALREADY_REVIEWED');
    }
}
