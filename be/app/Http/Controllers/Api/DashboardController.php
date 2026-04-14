<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Services\DashboardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class DashboardController extends Controller
{
    public function __construct(private readonly DashboardService $dashboardService) {}

    // GET /api/v1/admin/dashboard/overview
    public function overview(Request $request): JsonResponse
    {
        $request->validate([
            'days' => ['sometimes', 'integer', 'min:1', 'max:365'],
        ]);
        
        $days = (int) $request->get('days', 30);
        $data = $this->dashboardService->getOverview($days);
        
        return ApiResponse::success($data);
    }

    // GET /api/v1/admin/dashboard/charts
    public function charts(Request $request): JsonResponse
    {
        $request->validate([
            'days' => ['sometimes', 'integer', 'min:1', 'max:365'],
        ]);
        
        $days = (int) $request->get('days', 30);
        $data = $this->dashboardService->getRevenueChart($days);
        
        return ApiResponse::success($data);
    }

    // GET /api/v1/admin/dashboard/top-products
    public function topProducts(Request $request): JsonResponse
    {
        $request->validate([
            'limit' => ['sometimes', 'integer', 'min:1', 'max:50'],
        ]);
        
        $limit = (int) $request->get('limit', 5);
        $data = $this->dashboardService->getTopProducts($limit);
        
        return ApiResponse::success($data);
    }

    // GET /api/v1/admin/dashboard/customers
    public function customers(Request $request): JsonResponse
    {
        $filters = $request->only(['search']);
        $perPage = (int) $request->get('per_page', 15);

        $paginator = $this->dashboardService->getCustomers($filters, $perPage);
        
        return ApiResponse::success(
            $paginator->items(),
            meta: [
                'pagination' => [
                    'total'        => $paginator->total(),
                    'current_page' => $paginator->currentPage(),
                    'last_page'    => $paginator->lastPage(),
                    'per_page'     => $paginator->perPage(),
                ],
            ]
        );
    }
}
