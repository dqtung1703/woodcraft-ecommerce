<?php


namespace App\Http\Controllers\Api;

use App\DTOs\Voucher\CreateVoucherDTO;
use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Services\VoucherService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class VoucherController extends Controller
{
    public function __construct(private readonly VoucherService $voucherService) {}

    // POST /api/v1/vouchers/apply  (auth — preview trước khi đặt hàng)
    public function apply(Request $request): JsonResponse
    {
        $request->validate([
            'code'        => ['required', 'string', 'max:50'],
            'order_total' => ['required', 'numeric', 'min:0'],
        ]);

        $result = $this->voucherService->applyPreview(
            $request->code,
            $request->user()->id,
            (float) $request->order_total
        );

        return ApiResponse::success($result, 'Áp dụng voucher thành công.');
    }

    // GET /api/v1/admin/vouchers  (admin)
    public function index(Request $request): JsonResponse
    {
        $vouchers = $this->voucherService->adminList(
            $request->only(['status', 'search']),
            (int) $request->get('per_page', 15)
        );

        return ApiResponse::success(
            $vouchers->items(),
            meta: [
                'pagination' => [
                    'total'        => $vouchers->total(),
                    'current_page' => $vouchers->currentPage(),
                    'last_page'    => $vouchers->lastPage(),
                    'per_page'     => $vouchers->perPage(),
                ],
            ]
        );
    }

    // POST /api/v1/admin/vouchers  (admin)
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'code'            => ['required', 'string', 'max:50', 'alpha_dash'],
            'discount_type'   => ['required', 'in:percent,fixed'],
            'discount_value'  => ['required', 'numeric', 'min:0'],
            'min_order_value' => ['required', 'numeric', 'min:0'],
            'max_discount'    => ['nullable', 'numeric', 'min:0'],
            'quantity'        => ['required', 'integer', 'min:1'],
            'per_user_limit'  => ['nullable', 'integer', 'min:1'],
            'start_date'      => ['nullable', 'date'],
            'end_date'        => ['nullable', 'date', 'after_or_equal:start_date'],
        ], [
            'discount_type.in'       => 'Loại giảm giá phải là percent hoặc fixed.',
            'end_date.after_or_equal'=> 'Ngày kết thúc phải sau ngày bắt đầu.',
        ]);

        $voucher = $this->voucherService->create(
            CreateVoucherDTO::fromRequest($validated)
        );

        return ApiResponse::created($voucher, 'Tạo voucher thành công.');
    }

    // PUT /api/v1/admin/vouchers/{id}  (admin)
    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'code'            => ['sometimes', 'string', 'max:50', 'alpha_dash'],
            'discount_type'   => ['sometimes', 'in:percent,fixed'],
            'discount_value'  => ['sometimes', 'numeric', 'min:0'],
            'min_order_value' => ['sometimes', 'numeric', 'min:0'],
            'max_discount'    => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'quantity'        => ['sometimes', 'integer', 'min:1'],
            'per_user_limit'  => ['sometimes', 'nullable', 'integer', 'min:1'],
            'start_date'      => ['sometimes', 'nullable', 'date'],
            'end_date'        => ['sometimes', 'nullable', 'date'],
            'status'          => ['sometimes', 'in:active,inactive'],
        ]);

        $voucher = $this->voucherService->update($id, $validated);

        return ApiResponse::success($voucher, 'Cập nhật voucher thành công.');
    }

    // DELETE /api/v1/admin/vouchers/{id}  (admin)
    public function destroy(int $id): JsonResponse
    {
        $this->voucherService->delete($id);

        return ApiResponse::message('Xóa voucher thành công.');
    }
}
