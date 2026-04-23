<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Carbon\CarbonPeriod;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

final class DashboardService
{
    /**
     * Lấy thống kê tổng quan (Kèm phần trăm tăng trưởng)
     */
    public function getOverview(int $days = 30): array
    {
        $currentStart  = now()->subDays($days - 1)->startOfDay();
        $previousStart = now()->subDays(($days * 2) - 1)->startOfDay();

        // 1. Revenue (Chỉ tính đơn đã giao)
        $currentRevenue = Order::where('status', 'delivered')
            ->where('created_at', '>=', $currentStart)
            ->sum('final_price');

        $previousRevenue = Order::where('status', 'delivered')
            ->whereBetween('created_at', [$previousStart, $currentStart])
            ->sum('final_price');

        // 2. Orders (Đếm tất cả đơn hàng phát sinh)
        $currentOrders = Order::where('created_at', '>=', $currentStart)->count();
        $previousOrders = Order::whereBetween('created_at', [$previousStart, $currentStart])->count();

        // 3. Customers
        $currentCustomers = User::customers()->where('created_at', '>=', $currentStart)->count();
        $previousCustomers = User::customers()->whereBetween('created_at', [$previousStart, $currentStart])->count();

        // 4. Products Total
        $totalProducts = Product::count();

        return [
            'revenue' => [
                'value'  => (float) $currentRevenue,
                'growth' => $this->calculateGrowth($currentRevenue, $previousRevenue)
            ],
            'orders' => [
                'value'  => $currentOrders,
                'growth' => $this->calculateGrowth($currentOrders, $previousOrders)
            ],
            'customers' => [
                'value'  => $currentCustomers,
                'growth' => $this->calculateGrowth($currentCustomers, $previousCustomers)
            ],
            'total_products' => $totalProducts
        ];
    }

    /**
     * Biểu đồ doanh thu tự động Fill Zero cho ngày trống
     */
    public function getRevenueChart(int $days = 30): array
    {
        $startDate = now()->subDays($days - 1)->startOfDay();
        $endDate   = now()->endOfDay();

        $sales = Order::where('status', 'delivered')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(final_price) as total_revenue'),
                DB::raw('COUNT(id) as total_orders')
            )
            ->groupBy('date')
            ->get()
            ->keyBy('date');

        $chartData = [];
        $period = CarbonPeriod::create($startDate, '1 day', $endDate);

        foreach ($period as $date) {
            $dateString = $date->format('Y-m-d');
            $daySale    = $sales->get($dateString);

            $chartData[] = [
                'date'    => $dateString,
                'revenue' => $daySale ? (float) $daySale->total_revenue : 0,
                'orders'  => $daySale ? (int) $daySale->total_orders : 0
            ];
        }

        return $chartData;
    }

    /**
     * Top-Selling Products tính tới thời điểm hiện tại
     */
    public function getTopProducts(int $limit = 5): \Illuminate\Support\Collection
    {
        return Product::select('products.id', 'products.name', 'products.price')
            ->selectRaw('SUM(order_items.quantity) as total_sold')
            ->selectRaw('SUM(order_items.price * order_items.quantity) as total_revenue') 
            ->join('order_items', 'products.id', '=', 'order_items.product_id')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->where('orders.status', 'delivered')
            ->groupBy('products.id', 'products.name', 'products.price')
            ->orderByDesc('total_revenue')
            ->limit($limit)
            ->get()
            ->map(function ($product) {
               $product->total_revenue = (float) $product->total_revenue;
               $product->total_sold    = (int) $product->total_sold;
               return $product;
            });
    }

    /**
     * Danh sách User chi tiêu khủng dùng Subqueries siêu tối ưu
     */
    public function getCustomers(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = User::customers()
            ->withSum(['orders as total_spent' => function ($q) {
                $q->where('status', 'delivered');
            }], 'final_price')
            ->withCount(['orders' => function($q) {
                $q->where('status', 'delivered');
            }]);

        if (!empty($filters['search'])) {
            $query->where(function($q) use ($filters) {
                $q->where('name', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('email', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('phone', 'like', '%' . $filters['search'] . '%');
            });
        }

        return $query->orderByDesc('total_spent')->paginate($perPage);
    }
    /**
     * Helper tính phần trăm tăng trưởng
     */
    private function calculateGrowth(float|int $current, float|int $previous): float
    {
        if ($previous == 0) {
            return $current > 0 ? 100.0 : 0.0;
        }

        return round((($current - $previous) / $previous) * 100, 2);
    }
}
