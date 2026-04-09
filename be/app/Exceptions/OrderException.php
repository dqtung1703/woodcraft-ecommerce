<?php

// =============================================
// app/Exceptions/OrderException.php
// =============================================
namespace App\Exceptions;

class OrderException extends BusinessException
{
    public static function notFound(int $id): static
    {
        return new static("Đơn hàng #$id không tồn tại.", 404, 'ORDER_NOT_FOUND');
    }

    public static function cannotCancel(): static
    {
        return new static('Không thể hủy đơn hàng ở trạng thái này.', 422, 'CANNOT_CANCEL');
    }

    public static function invalidStatusTransition(string $from, string $to): static
    {
        return new static(
            "Không thể chuyển trạng thái từ '$from' sang '$to'.",
            422,
            'INVALID_STATUS_TRANSITION'
        );
    }
}