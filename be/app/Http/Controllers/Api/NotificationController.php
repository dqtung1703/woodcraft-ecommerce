<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class NotificationController extends Controller
{
    public function __construct(private readonly NotificationService $notificationService) {}

    public function index(Request $request): JsonResponse
    {
        $perPage = (int) $request->get('per_page', 10);
        $notifications = $this->notificationService->listForUser($request->user(), $perPage);

        return ApiResponse::success($notifications);
    }

    public function unreadCount(Request $request): JsonResponse
    {
        return ApiResponse::success([
            'count' => $this->notificationService->unreadCount($request->user()),
        ]);
    }

    public function markAsRead(Request $request, int $id): JsonResponse
    {
        $notification = $this->notificationService->markAsRead($request->user(), $id);

        return ApiResponse::success($notification, 'Đã đánh dấu thông báo là đã đọc.');
    }

    public function markAllAsRead(Request $request): JsonResponse
    {
        $count = $this->notificationService->markAllAsRead($request->user());

        return ApiResponse::success(['updated' => $count], 'Đã đọc tất cả thông báo.');
    }
}
