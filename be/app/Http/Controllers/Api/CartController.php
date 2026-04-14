<?php

// =============================================
// app/Http/Controllers/Api/CartController.php
// =============================================
namespace App\Http\Controllers\Api;

use App\DTOs\Cart\AddToCartDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Cart\AddToCartRequest;
use App\Http\Requests\Cart\UpdateCartItemRequest;
use App\Http\Responses\ApiResponse;
use App\Services\CartService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class CartController extends Controller
{
    public function __construct(private readonly CartService $cartService) {}

    // GET /api/v1/cart
    public function index(Request $request): JsonResponse
    {
        $summary = $this->cartService->getSummary($request->user()->id);

        return ApiResponse::success($summary);
    }

    // POST /api/v1/cart
    public function store(AddToCartRequest $request): JsonResponse
    {
        $this->cartService->addItem(
            $request->user()->id,
            AddToCartDTO::fromRequest($request->validated())
        );

        $summary = $this->cartService->getSummary($request->user()->id);

        return ApiResponse::success($summary, 'Đã thêm sản phẩm vào giỏ hàng.');
    }

    // PUT /api/v1/cart/{itemId}
    public function update(UpdateCartItemRequest $request, int $itemId): JsonResponse
    {
        $this->cartService->updateItem(
            $request->user()->id,
            $itemId,
            $request->validated('quantity')
        );

        $summary = $this->cartService->getSummary($request->user()->id);

        return ApiResponse::success($summary, 'Đã cập nhật giỏ hàng.');
    }

    // DELETE /api/v1/cart/{itemId}
    public function destroy(Request $request, int $itemId): JsonResponse
    {
        $this->cartService->removeItem($request->user()->id, $itemId);

        $summary = $this->cartService->getSummary($request->user()->id);

        return ApiResponse::success($summary, 'Đã xóa sản phẩm khỏi giỏ hàng.');
    }

    // DELETE /api/v1/cart
    public function clear(Request $request): JsonResponse
    {
        $this->cartService->clearCart($request->user()->id);

        return ApiResponse::message('Đã xóa toàn bộ giỏ hàng.');
    }
}
