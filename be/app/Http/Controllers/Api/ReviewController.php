<?php


namespace App\Http\Controllers\Api;

use App\DTOs\Review\CreateReviewDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Review\StoreReviewRequest;
use App\Http\Responses\ApiResponse;
use App\Services\ReviewService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class ReviewController extends Controller
{
    public function __construct(private readonly ReviewService $reviewService) {}

    // GET /api/v1/products/{id}/reviews (Public endpoint)
    public function index(Request $request, int $productId): JsonResponse
    {
        $reviews = $this->reviewService->getProductReviews(
            $productId,
            $request->only(['rating']),
            (int) $request->get('per_page', 15)
        );

        $summary = $this->reviewService->getSummary($productId);

        return ApiResponse::success(
            $reviews->items(),
            meta: [
                'summary'    => $summary,
                'pagination' => [
                    'total'        => $reviews->total(),
                    'current_page' => $reviews->currentPage(),
                    'last_page'    => $reviews->lastPage(),
                    'per_page'     => $reviews->perPage(),
                ],
            ]
        );
    }

    // POST /api/v1/reviews (Auth required)
    public function store(StoreReviewRequest $request): JsonResponse
    {
        $dto = CreateReviewDTO::fromRequest($request->validated(), $request->user()->id);
        
        $review = $this->reviewService->create($dto);

        return ApiResponse::created([
    'id'         => $review->id,
    'rating'     => $review->rating,
    'comment'    => $review->comment,
    'user'       => $review->user?->name,
    'created_at' => $review->created_at?->format('d/m/Y'),
], 'Cảm ơn bạn đã đánh giá sản phẩm.');
    }

    // ==========================================
    // ADMIN ENDPOINTS
    // ==========================================

    // GET /api/v1/admin/reviews
    public function adminIndex(Request $request): JsonResponse
    {
        $reviews = $this->reviewService->adminList(
            $request->only(['product_id', 'rating', 'search']),
            (int) $request->get('per_page', 15)
        );

        return ApiResponse::success(
            $reviews->items(),
            meta: [
                'pagination' => [
                    'total'        => $reviews->total(),
                    'current_page' => $reviews->currentPage(),
                    'last_page'    => $reviews->lastPage(),
                    'per_page'     => $reviews->perPage(),
                ],
            ]
        );
    }

    // DELETE /api/v1/admin/reviews/{id}
    public function destroy(int $id): JsonResponse
    {
        $this->reviewService->destroy($id);

        return ApiResponse::message('Đã xóa đánh giá thành công.');
    }
}
