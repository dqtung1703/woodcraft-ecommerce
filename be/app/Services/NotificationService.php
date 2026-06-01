<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\Order;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final class NotificationService
{
    public function createForAdminNewOrder(Order $order): Notification
    {
        return Notification::create([
            'target_role' => 'admin',
            'type'        => 'order_pending',
            'title'       => 'Đơn hàng mới',
            'message'     => "Đơn hàng #{$order->id} đang chờ xác nhận.",
            'data'        => ['order_id' => $order->id, 'status' => $order->status],
        ]);
    }

    public function createForOrderStatus(Order $order, string $newStatus): ?Notification
    {
        $labels = [
            'confirmed' => 'đã được xác nhận',
            'shipping'  => 'đang được giao',
            'delivered' => 'đã được giao thành công',
            'cancelled' => 'đã bị hủy',
        ];

        if (!isset($labels[$newStatus])) {
            return null;
        }

        return Notification::create([
            'user_id'     => $order->user_id,
            'target_role' => 'customer',
            'type'        => 'order_status_changed',
            'title'       => 'Cập nhật đơn hàng',
            'message'     => "Đơn hàng #{$order->id} {$labels[$newStatus]}.",
            'data'        => ['order_id' => $order->id, 'status' => $newStatus],
        ]);
    }

    public function listForUser(User $user, int $perPage = 10): LengthAwarePaginator
    {
        return Notification::visibleTo($user)
            ->latest()
            ->paginate($perPage);
    }

    public function unreadCount(User $user): int
    {
        return Notification::visibleTo($user)
            ->whereNull('read_at')
            ->count();
    }

    public function markAsRead(User $user, int $id): Notification
    {
        $notification = Notification::visibleTo($user)->findOrFail($id);
        if (!$notification->read_at) {
            $notification->update(['read_at' => now()]);
        }

        return $notification->fresh();
    }

    public function markAllAsRead(User $user): int
    {
        return Notification::visibleTo($user)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);
    }
}
