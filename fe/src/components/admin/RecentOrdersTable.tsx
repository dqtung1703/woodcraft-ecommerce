import type { AdminOrder } from '@/types/admin';
import { formatCurrency } from '@/utils/formatCurrency';

type RecentOrdersTableProps = {
  orders: AdminOrder[];
  loading?: boolean;
};

export default function RecentOrdersTable({ orders, loading = false }: RecentOrdersTableProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <h2 className="text-base font-semibold text-slate-950">Đơn hàng gần đây</h2>
        <p className="mt-1 text-sm text-slate-500">5 đơn mới nhất trong hệ thống</p>
      </div>

      <div className="mt-5 overflow-hidden rounded-md border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Mã</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Khách hàng</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Tổng tiền</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  <td className="px-4 py-4"><div className="h-4 w-12 animate-pulse rounded bg-slate-200" /></td>
                  <td className="px-4 py-4"><div className="h-4 w-32 animate-pulse rounded bg-slate-200" /></td>
                  <td className="px-4 py-4"><div className="ml-auto h-4 w-24 animate-pulse rounded bg-slate-200" /></td>
                  <td className="px-4 py-4"><div className="h-5 w-20 animate-pulse rounded-full bg-slate-200" /></td>
                </tr>
              ))
            ) : orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50">
                  <td className="px-4 py-4 font-semibold text-slate-900">#{order.id}</td>
                  <td className="px-4 py-4 text-slate-700">{order.user?.name ?? order.shipping_name ?? '-'}</td>
                  <td className="px-4 py-4 text-right font-semibold text-slate-900">{formatCurrency(order.final_price)}</td>
                  <td className="px-4 py-4">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                      {order.status_label}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-sm text-slate-500">
                  Chưa có đơn hàng
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
