<?php


namespace App\Services;

use App\DTOs\Review\CreateReviewDTO;
use App\Exceptions\ReviewException;
use App\Models\Order;
use App\Models\Review;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Log;

final class ReviewService
{
    /**
     * Tạo Review và kiểm tra các ràng buộc mua hàng
     */
    public function create(CreateReviewDTO $dto): Review
    {
        // 1. Kiểm tra đã mua hàng và đơn chuyển sang trạng thái "delivered" chưa
        $hasPurchased = Order::where('user_id', $dto->userId)
            ->where('status', 'delivered')
            ->whereHas('items', function ($query) use ($dto) {
                $query->where('product_id', $dto->productId);
            })
            ->exists();

        if (!$hasPurchased) {
            throw ReviewException::notPurchased();
        }

        // 2. Chống phân mảnh: Mỗi user chỉ đánh giá 1 sản phẩm Cụ Thể 1 lần duy nhất
        $alreadyReviewed = Review::where('user_id', $dto->userId)
            ->where('product_id', $dto->productId)
            ->exists();

        if ($alreadyReviewed) {
            throw ReviewException::alreadyReviewed();
        }

        // 3. Tạo Review
        $review = Review::create([
            'user_id'    => $dto->userId,
            'product_id' => $dto->productId,
            'rating'     => $dto->rating,
            'comment'    => $dto->comment,
            'created_at' => now(),
        ]);

        Log::info('New Review Submited', [
            'user_id'    => $dto->userId,
            'product_id' => $dto->productId,
            'rating'     => $dto->rating
        ]);

        return $review->load('user:id,name');
    }

    /**
     * Thống kê tổng quan Review của 1 Sản phẩm duy nhất (Tối ưu xuống 1 Query)
     */
    public function getSummary(int $productId): array
    {
        $result = Review::where('product_id', $productId)
            ->selectRaw('
                COUNT(*) as total_reviews,
                ROUND(AVG(rating), 1) as avg_rating,
                SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as star_5,
                SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as star_4,
                SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as star_3,
                SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as star_2,
                SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as star_1
            ')
            ->first();

        $total = (int) ($result->total_reviews ?? 0);

        return [
            'total_reviews' => $total,
            'avg_rating'    => (float) ($result->avg_rating ?? 0),
            'distribution'  => [
                5 => (int) ($result->star_5 ?? 0),
                4 => (int) ($result->star_4 ?? 0),
                3 => (int) ($result->star_3 ?? 0),
                2 => (int) ($result->star_2 ?? 0),
                1 => (int) ($result->star_1 ?? 0),
            ]
        ];
    }

    /**
     * Public API - Lấy Feedback để hiển thị cho KH
     */
    public function getProductReviews(int $productId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Review::with('user:id,name')
            ->where('product_id', $productId);

        if (!empty($filters['rating'])) {
            $query->where('rating', $filters['rating']);
        }

        return $query->latest('created_at')->paginate($perPage);
    }

    /**
     * Dành cho Admin Quản lý (Có Search và Filter chéo sản phẩm)
     */
    public function adminList(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Review::with(['user:id,name', 'product:id,name']);

        if (!empty($filters['product_id'])) {
            $query->where('product_id', $filters['product_id']);
        }

        if (!empty($filters['rating'])) {
            $query->where('rating', $filters['rating']);
        }

        if (!empty($filters['search'])) {
            $query->where('comment', 'like', '%' . $filters['search'] . '%');
        }

        return $query->latest('created_at')->paginate($perPage);
    }

    public function destroy(int $id): void
    {
        $review = Review::findOrFail($id);
        $review->delete();
        Log::info('Review deleted by Admin', ['review_id' => $id]);
    }
}
