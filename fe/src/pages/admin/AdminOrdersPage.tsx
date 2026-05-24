import { Eye } from 'lucide-react';
import { useEffect, useState } from 'react';
import AdminTable from '@/components/admin/AdminTable';
import OrderDetailModal from '@/components/admin/OrderDetailModal';
import { useToast } from '@/contexts/ToastContext';
import { adminOrderService } from '@/services/adminService';
import type { AdminOrder } from '@/types/admin';
import type { OrderStatus } from '@/types/order';
import { formatCurrency } from '@/utils/formatCurrency';

const statusOptions = [
  { value: '', label: 'Tất cả' },
  { value: 'pending', label: 'Chờ xác nhận' },
  { value: 'processing', label: 'Đang xử lý' },
  { value: 'confirmed', label: 'Đã xác nhận' },
  { value: 'shipping', label: 'Đang giao' },
  { value: 'delivered', label: 'Đã giao' },
  { value: 'cancelled', label: 'Đã hủy' },
];

export default function AdminOrdersPage() {
  const toast = useToast();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [selected, setSelected] = useState<AdminOrder | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  const loadOrders = async (nextPage = page) => {
    setLoading(true);
    try {
      const result = await adminOrderService.getAll({
        status: status || undefined,
        search: search || undefined,
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
        page: nextPage,
        per_page: 12,
      });
      setOrders(result.data);
      setPage(result.meta.pagination?.current_page ?? nextPage);
      setLastPage(result.meta.pagination?.last_page ?? 1);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không tải được đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadOrders(1);
  }, [status]);

  const openDetail = async (order: AdminOrder) => {
    setSelected(order);
    setDetailLoading(true);
    try {
      setSelected(await adminOrderService.getById(order.id));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không tải được chi tiết đơn');
    } finally {
      setDetailLoading(false);
    }
  };

  const updateStatus = async (nextStatus: OrderStatus) => {
    if (!selected) return;
    setUpdating(true);
    try {
      await adminOrderService.updateStatus(selected.id, nextStatus);
      const updated = await adminOrderService.getById(selected.id);
      toast.success('Đã cập nhật trạng thái đơn hàng');
      setSelected(updated);
      await loadOrders();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Cập nhật trạng thái thất bại');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-slate-950">Đơn hàng</h2>
        <p className="mt-1 text-sm text-slate-500">Theo dõi và cập nhật trạng thái đơn hàng.</p>
      </div>

      <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 lg:grid-cols-[180px_1fr_160px_160px_auto]">
        <select value={status} onChange={(event) => setStatus(event.target.value)} className="admin-input">
          {statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
        <input value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && void loadOrders(1)} placeholder="Tìm tên/email khách" className="admin-input" />
        <input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} className="admin-input" />
        <input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} className="admin-input" />
        <button onClick={() => void loadOrders(1)} className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Lọc</button>
      </div>

      <AdminTable
        data={orders}
        loading={loading}
        keyExtractor={(row) => row.id}
        columns={[
          { key: 'id', label: 'Mã', render: (row) => <span className="font-semibold text-slate-900">#{row.id}</span> },
          { key: 'customer', label: 'Khách hàng', render: (row) => row.user?.name ?? row.shipping_name ?? '-' },
          { key: 'total', label: 'Tổng tiền', render: (row) => formatCurrency(row.final_price) },
          {
            key: 'payment',
            label: 'Thanh toán',
            render: (row) => {
              const methodLabels: Record<string, string> = {
                cod: 'COD',
                vnpay: 'VNPay',
              };
              const statusLabels: Record<string, string> = {
                pending: 'Chưa thanh toán',
                paid: 'Đã thanh toán',
                failed: 'Thất bại',
                refunded: 'Đã hoàn tiền',
              };
              const m = methodLabels[row.payment_method.toLowerCase()] ?? row.payment_method;
              const s = statusLabels[row.payment_status.toLowerCase()] ?? row.payment_status;
              return `${m} / ${s}`;
            },
          },
          { key: 'status', label: 'Trạng thái', render: (row) => <OrderStatusBadge status={row.status} label={row.status_label} /> },
          { key: 'date', label: 'Ngày', render: (row) => row.created_at },
          {
            key: 'actions',
            label: '',
            className: 'text-right',
            render: (row) => (
              <button onClick={() => void openDetail(row)} className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-950">
                <Eye className="h-4 w-4" />
              </button>
            ),
          },
        ]}
      />

      <div className="flex justify-end gap-2">
        <button disabled={page <= 1 || loading} onClick={() => void loadOrders(page - 1)} className="rounded-md border border-slate-200 px-3 py-2 text-sm disabled:opacity-50">Trước</button>
        <span className="px-3 py-2 text-sm text-slate-600">{page}/{lastPage}</span>
        <button disabled={page >= lastPage || loading} onClick={() => void loadOrders(page + 1)} className="rounded-md border border-slate-200 px-3 py-2 text-sm disabled:opacity-50">Sau</button>
      </div>

      <OrderDetailModal order={selected} loading={detailLoading} updating={updating} onClose={() => setSelected(null)} onUpdateStatus={updateStatus} />
    </div>
  );
}

function OrderStatusBadge({ status, label }: { status: OrderStatus; label: string }) {
  const classes: Record<OrderStatus, string> = {
    pending: 'bg-amber-100 text-amber-700',
    processing: 'bg-blue-100 text-blue-700',
    confirmed: 'bg-indigo-100 text-indigo-700',
    shipping: 'bg-cyan-100 text-cyan-700',
    delivered: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-red-100 text-red-700',
  };
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${classes[status]}`}>{label}</span>;
}
