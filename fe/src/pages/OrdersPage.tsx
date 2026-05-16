import { Package } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '@/services/orderService';
import type { Order, OrderStatus } from '@/types/order';
import { formatCurrency } from '@/utils/formatCurrency';
import { toOrderDetail } from '@/utils/routePaths';

// ── Status badge config ───────────────────────────────────────────────────────

const STATUS_CONFIG: Partial<Record<
  OrderStatus,
  { label: string; className: string }
>> = {
  pending:   { label: 'Chờ xác nhận', className: 'bg-amber-100 text-amber-800' },
  confirmed: { label: 'Đã xác nhận',  className: 'bg-blue-100 text-blue-800' },
  shipping:  { label: 'Đang giao',    className: 'bg-purple-100 text-purple-800' },
  delivered: { label: 'Đã giao',      className: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Đã hủy',       className: 'bg-red-100 text-red-700' },
};

// ── Skeleton ──────────────────────────────────────────────────────────────────

function OrderRowSkeleton() {
  return (
    <div className="flex items-center justify-between p-5 bg-white rounded-2xl border border-outline-variant/30 animate-pulse">
      <div className="flex flex-col gap-2">
        <div className="h-4 w-28 bg-surface-container-highest rounded" />
        <div className="h-3 w-36 bg-surface-container-high rounded" />
      </div>
      <div className="hidden md:flex flex-col items-end gap-2">
        <div className="h-4 w-24 bg-surface-container-highest rounded" />
        <div className="h-5 w-20 bg-surface-container-high rounded-full" />
      </div>
      <div className="h-4 w-16 bg-surface-container-high rounded" />
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    orderService
      .getOrders()
      .then(setOrders)
      .catch(() => setError('Không thể tải danh sách đơn hàng. Vui lòng thử lại.'))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 md:px-12 py-16">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-serif text-on-surface">Đơn hàng của tôi</h1>
        <p className="text-on-surface-variant text-sm mt-1">
          Theo dõi và quản lý tất cả đơn hàng của bạn
        </p>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex flex-col gap-3" aria-busy="true" aria-label="Đang tải đơn hàng">
          {Array.from({ length: 4 }).map((_, i) => (
            <OrderRowSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Error */}
      {!isLoading && error && (
        <div className="text-center py-20 text-on-surface-variant">
          <Package className="w-14 h-14 mx-auto mb-4 opacity-40" />
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={() => { setIsLoading(true); setError(null); orderService.getOrders().then(setOrders).catch(() => setError('Không thể tải. Vui lòng thử lại.')).finally(() => setIsLoading(false)); }}
            className="mt-4 text-sm text-primary hover:underline"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !error && orders.length === 0 && (
        <div className="text-center py-24">
          <Package className="w-16 h-16 mx-auto mb-4 text-outline-variant" />
          <h2 className="font-serif text-xl text-on-surface mb-2">Chưa có đơn hàng nào</h2>
          <p className="text-on-surface-variant text-sm mb-6">
            Khám phá bộ sưu tập của chúng tôi và đặt hàng ngay hôm nay.
          </p>
          <Link
            to="/products"
            className="inline-block px-6 py-3 bg-primary text-white text-sm font-medium rounded-full hover:bg-primary/90 transition-colors"
          >
            Xem bộ sưu tập
          </Link>
        </div>
      )}

      {/* Order list */}
      {!isLoading && !error && orders.length > 0 && (
        <div className="flex flex-col gap-3" role="list" aria-label="Danh sách đơn hàng">
          {orders.map((order) => {
            const { label, className } = STATUS_CONFIG[order.status] ?? { label: order.status, className: 'bg-gray-100 text-gray-700' };
            return (
              <Link
                key={order.id}
                to={toOrderDetail(order.id)}
                role="listitem"
                className="group flex items-center justify-between p-5 bg-white rounded-2xl border border-outline-variant/30 hover:border-primary/40 hover:shadow-md transition-all duration-200"
              >
                {/* Left: id + date + items */}
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="font-serif text-on-surface font-medium text-base group-hover:text-primary transition-colors">
                    Đơn #{order.id}
                  </span>
                  <span className="text-xs text-on-surface-variant">
                    {new Date(order.created_at).toLocaleDateString('vi-VN', {
                      day: '2-digit', month: '2-digit', year: 'numeric',
                    })}
                    {' · '}
                    {order.items_count} sản phẩm
                  </span>
                </div>

                {/* Middle: total + status (hidden on mobile) */}
                <div className="hidden md:flex flex-col items-end gap-1.5">
                  <span className="font-medium text-on-surface text-sm">
                    {formatCurrency(order.final_price)}
                  </span>
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${className}`}>
                    {label}
                  </span>
                </div>

                {/* Right: chevron */}
                <span className="text-outline-variant group-hover:text-primary ml-4 transition-colors text-lg">›</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
