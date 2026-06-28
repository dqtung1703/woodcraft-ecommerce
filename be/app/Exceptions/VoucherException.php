<?php


namespace App\Exceptions;

class VoucherException extends BusinessException
{
    public static function notFound(): static
    {
        return new static('Mã voucher không tồn tại.', 404, 'VOUCHER_NOT_FOUND');
    }

    public static function expired(): static
    {
        return new static('Mã voucher đã hết hạn.', 422, 'VOUCHER_EXPIRED');
    }

    public static function exhausted(): static
    {
        return new static('Mã voucher đã hết lượt sử dụng.', 422, 'VOUCHER_EXHAUSTED');
    }

    public static function belowMinOrder(float $min): static
    {
        return new static(
            'Đơn hàng chưa đạt giá trị tối thiểu ' . number_format($min, 0, ',', '.') . 'đ.',
            422,
            'BELOW_MIN_ORDER'
        );
    }

    public static function userLimitReached(): static
    {
        return new static('Bạn đã dùng hết lượt sử dụng voucher này.', 422, 'USER_LIMIT_REACHED');
    }

    public static function codeAlreadyExists(): static
    {
        return new static('Mã voucher này đã tồn tại trong hệ thống.', 422, 'VOUCHER_CODE_EXISTS');
    }

    public static function quantityBelowUsedCount(): static
    {
        return new static(
            'Số lượng mới không được nhỏ hơn số lượt đã sử dụng.',
            422,
            'QUANTITY_BELOW_USED_COUNT'
        );
    }

    public static function cannotDeleteUsed(): static
    {
        return new static(
            'Không thể xóa voucher đã được sử dụng. Hãy đổi trạng thái thành inactive.',
            422,
            'VOUCHER_ALREADY_USED'
        );
    }
}