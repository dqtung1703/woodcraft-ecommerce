<?php

// =============================================
// app/Http/Controllers/Api/OrderController.php
// =============================================
namespace App\Http\Controllers\Api;

use App\DTOs\Order\PlaceOrderDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Order\PlaceOrderRequest;
use App\Http\Resources\OrderResource;
use App\Http\Responses\ApiResponse;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class OrderController extends Controller
{
    public function __construct(private readonly OrderService $orderService) {}

    // GET /api/v1/orders
    public function index(Request $request): JsonResponse
    {
        $orders = $this->orderService->getUserOrders($request->user()->id);

        return ApiResponse::success(
            OrderResource::collection($orders->getCollection()),
            meta: [
                'pagination' => [
                    'total'        => $orders->total(),
                    'current_page' => $orders->currentPage(),
                    'last_page'    => $orders->lastPage(),
                ],
            ]
        );
    }

    // GET /api/v1/orders/{id}
    public function show(Request $request, int $id): JsonResponse
    {
        $order = $this->orderService->getUserOrder($id, $request->user()->id);

        return ApiResponse::success(new OrderResource($order));
    }

    // POST /api/v1/orders
    public function store(PlaceOrderRequest $request): JsonResponse
    {
        $order = $this->orderService->placeOrder(
            PlaceOrderDTO::fromRequest($request->validated(), $request->user()->id)
        );

        return ApiResponse::created(new OrderResource($order), 'Đặt hàng thành công.');
    }

    // PUT /api/v1/orders/{id}/cancel
    public function cancel(Request $request, int $id): JsonResponse
    {
        $order = $this->orderService->cancelOrder($id, $request->user()->id);

        return ApiResponse::success(new OrderResource($order), 'Hủy đơn hàng thành công.');
    }

    // GET /api/v1/admin/orders
    public function adminIndex(Request $request): JsonResponse
    {
        $orders = $this->orderService->getAllOrders(
            $request->only(['status', 'search', 'date_from', 'date_to']),
            (int) $request->get('per_page', 15)
        );

        return ApiResponse::success(
            OrderResource::collection($orders->getCollection()),
            meta: [
                'pagination' => [
                    'total'        => $orders->total(),
                    'current_page' => $orders->currentPage(),
                    'last_page'    => $orders->lastPage(),
                ],
            ]
        );
    }

    // PUT /api/v1/admin/orders/{id}/status
    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'status' => ['required', 'in:confirmed,shipping,delivered,cancelled'],
        ]);

        $order = $this->orderService->updateStatus($id, $request->status);

        return ApiResponse::success(new OrderResource($order), 'Cập nhật trạng thái thành công.');
    }
}
