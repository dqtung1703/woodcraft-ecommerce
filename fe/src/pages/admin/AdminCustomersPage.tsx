import { Search, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import AdminTable from '@/components/admin/AdminTable';
import { useToast } from '@/contexts/ToastContext';
import { adminDashboardService } from '@/services/adminService';
import type { AdminCustomer } from '@/types/admin';
import { formatCurrency } from '@/utils/formatCurrency';

export default function AdminCustomersPage() {
  const toast = useToast();
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  const loadCustomers = async (nextPage = page) => {
    setLoading(true);
    try {
      const result = await adminDashboardService.getCustomers({
        search: search || undefined,
        page: nextPage,
        per_page: 12,
      });
      setCustomers(result.data);
      setPage(result.meta.pagination?.current_page ?? nextPage);
      setLastPage(result.meta.pagination?.last_page ?? 1);
      setTotal(result.meta.pagination?.total ?? result.data.length);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không tải được danh sách khách hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (customer: AdminCustomer) => {
    const actionText = customer.is_active ? 'khóa' : 'mở khóa';
    if (!window.confirm(`Bạn có chắc chắn muốn ${actionText} tài khoản của ${customer.name}?`)) {
      return;
    }

    try {
      const updated = await adminDashboardService.toggleCustomerStatus(customer.id);
      toast.success(`${customer.is_active ? 'Khóa' : 'Mở khóa'} tài khoản thành công`);
      setCustomers((prev) =>
        prev.map((c) => (c.id === customer.id ? { ...c, is_active: updated.is_active } : c))
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : `Không thể ${actionText} tài khoản`);
    }
  };

  useEffect(() => {
    void loadCustomers(1);
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-950">Khách hàng</h2>
          <p className="mt-1 text-sm text-slate-500">
            Xem danh sách khách hàng, tổng chi tiêu và số đơn thành công.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
          <Users className="h-4 w-4" />
          {total.toLocaleString('vi-VN')} khách hàng
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row">
        <div className="relative flex-1 sm:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && void loadCustomers(1)}
            placeholder="Tìm theo tên, email hoặc số điện thoại"
            className="admin-input pl-9"
          />
        </div>
        <button
          onClick={() => void loadCustomers(1)}
          className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Tìm kiếm
        </button>
      </div>

      <AdminTable
        data={customers}
        loading={loading}
        emptyText="Không có khách hàng"
        keyExtractor={(row) => row.id}
        columns={[
          {
            key: 'customer',
            label: 'Khách hàng',
            render: (row) => (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">
                  {getInitials(row.name)}
                </div>
                <div>
                  <p className="font-medium text-slate-900">{row.name}</p>
                  <p className="text-xs text-slate-500">{row.email}</p>
                </div>
              </div>
            ),
          },
          { key: 'phone', label: 'SĐT', render: (row) => row.phone || '-' },
          {
            key: 'spent',
            label: 'Tổng chi tiêu',
            className: 'text-right',
            render: (row) => (
              <span className="font-semibold text-slate-900">
                {formatCurrency(Number(row.total_spent ?? 0))}
              </span>
            ),
          },
          {
            key: 'orders',
            label: 'Số đơn',
            className: 'text-right',
            render: (row) => row.orders_count,
          },
          {
            key: 'status',
            label: 'Trạng thái',
            render: (row) => (
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                  row.is_active
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {row.is_active ? 'Hoạt động' : 'Đang khóa'}
              </span>
            ),
          },
          { key: 'created', label: 'Ngày đăng ký', render: (row) => row.created_at },
          {
            key: 'actions',
            label: 'Thao tác',
            className: 'text-right',
            render: (row) => (
              <button
                onClick={() => void handleToggleStatus(row)}
                className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-semibold border transition-all ${
                  row.is_active
                    ? 'bg-white hover:bg-rose-50 text-rose-600 border-rose-200 hover:border-rose-300'
                    : 'bg-white hover:bg-emerald-50 text-emerald-600 border-emerald-200 hover:border-emerald-300'
                }`}
              >
                {row.is_active ? 'Khóa' : 'Mở khóa'}
              </button>
            ),
          },
        ]}
      />

      <div className="flex justify-end gap-2">
        <button
          disabled={page <= 1 || loading}
          onClick={() => void loadCustomers(page - 1)}
          className="rounded-md border border-slate-200 px-3 py-2 text-sm disabled:opacity-50"
        >
          Trước
        </button>
        <span className="px-3 py-2 text-sm text-slate-600">{page}/{lastPage}</span>
        <button
          disabled={page >= lastPage || loading}
          onClick={() => void loadCustomers(page + 1)}
          className="rounded-md border border-slate-200 px-3 py-2 text-sm disabled:opacity-50"
        >
          Sau
        </button>
      </div>
    </div>
  );
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'KH';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}
