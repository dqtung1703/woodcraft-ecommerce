import { Package, ShoppingCart, Users, WalletCards } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import RevenueChart from '@/components/admin/RevenueChart';
import RecentOrdersTable from '@/components/admin/RecentOrdersTable';
import StatCard from '@/components/admin/StatCard';
import TopProductsTable from '@/components/admin/TopProductsTable';
import { useToast } from '@/contexts/ToastContext';
import { adminDashboardService, adminOrderService } from '@/services/adminService';
import type { AdminOrder, ChartDataPoint, DashboardOverview, TopProduct } from '@/types/admin';
import { formatCurrency } from '@/utils/formatCurrency';

export default function AdminDashboardPage() {
  const toast = useToast();
  const [days, setDays] = useState(30);
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [recentOrders, setRecentOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboard = useCallback(async (selectedDays: number) => {
    setLoading(true);
    try {
      const [overviewData, chart, products, orders] = await Promise.all([
        adminDashboardService.getOverview(selectedDays),
        adminDashboardService.getCharts(selectedDays),
        adminDashboardService.getTopProducts(5),
        adminOrderService.getAll({ per_page: 5 }),
      ]);

      setOverview(overviewData);
      setChartData(chart);
      setTopProducts(products);
      setRecentOrders(orders.data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không tải được dashboard');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    void loadDashboard(days);
  }, [days, loadDashboard]);

  if (loading && !overview) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Doanh thu"
          value={formatCurrency(overview?.revenue.value ?? 0)}
          growth={overview?.revenue.growth}
          subtitle={`so với ${days} ngày trước`}
          icon={WalletCards}
        />
        <StatCard
          title="Đơn hàng"
          value={(overview?.orders.value ?? 0).toLocaleString('vi-VN')}
          growth={overview?.orders.growth}
          subtitle={`so với ${days} ngày trước`}
          icon={ShoppingCart}
        />
        <StatCard
          title="Khách hàng mới"
          value={(overview?.customers.value ?? 0).toLocaleString('vi-VN')}
          growth={overview?.customers.growth}
          subtitle={`so với ${days} ngày trước`}
          icon={Users}
        />
        <StatCard
          title="Tổng sản phẩm"
          value={(overview?.total_products ?? 0).toLocaleString('vi-VN')}
          icon={Package}
        />
      </div>

      <RevenueChart data={chartData} days={days} onDaysChange={setDays} />

      <div className="grid gap-6 xl:grid-cols-2">
        <TopProductsTable products={topProducts} loading={loading} />
        <RecentOrdersTable orders={recentOrders} loading={loading} />
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
            <div className="mt-4 h-8 w-36 animate-pulse rounded bg-slate-200" />
            <div className="mt-5 h-4 w-28 animate-pulse rounded bg-slate-100" />
          </div>
        ))}
      </div>
      <div className="h-96 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="h-full animate-pulse rounded bg-slate-100" />
      </div>
    </div>
  );
}
