import { Edit, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import AdminTable from '@/components/admin/AdminTable';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import VoucherModal from '@/components/admin/VoucherModal';
import { useToast } from '@/contexts/ToastContext';
import { adminVoucherService } from '@/services/adminService';
import type { AdminVoucher, CreateVoucherPayload, UpdateVoucherPayload } from '@/types/admin';
import { formatCurrency } from '@/utils/formatCurrency';

function displayStatus(voucher: AdminVoucher) {
  if (voucher.status === 'inactive') return 'inactive';
  if (voucher.end_date && new Date(voucher.end_date) < new Date()) return 'expired';
  return 'active';
}

export default function AdminVouchersPage() {
  const toast = useToast();
  const [vouchers, setVouchers] = useState<AdminVoucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminVoucher | null>(null);
  const [deleting, setDeleting] = useState<AdminVoucher | null>(null);

  const loadVouchers = async () => {
    setLoading(true);
    try {
      const result = await adminVoucherService.getAll({
        search: search || undefined,
        status: status || undefined,
        per_page: 50,
      });
      setVouchers(result.data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không tải được voucher');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadVouchers();
  }, [status]);

  const submitVoucher = async (payload: CreateVoucherPayload | UpdateVoucherPayload) => {
    setSaving(true);
    try {
      if (editing) {
        await adminVoucherService.update(editing.id, payload);
        toast.success('Đã cập nhật voucher');
      } else {
        await adminVoucherService.create(payload as CreateVoucherPayload);
        toast.success('Đã tạo voucher');
      }
      setModalOpen(false);
      await loadVouchers();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Lưu voucher thất bại');
    } finally {
      setSaving(false);
    }
  };

  const deleteVoucher = async () => {
    if (!deleting) return;
    setSaving(true);
    try {
      await adminVoucherService.delete(deleting.id);
      toast.success('Đã xóa voucher');
      setDeleting(null);
      await loadVouchers();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Xóa voucher thất bại');
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (voucher: AdminVoucher) => {
    const next = voucher.status === 'active' ? 'inactive' : 'active';
    try {
      await adminVoucherService.update(voucher.id, { status: next });
      toast.success('Đã đổi trạng thái voucher');
      await loadVouchers();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Đổi trạng thái thất bại');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-950">Voucher</h2>
          <p className="mt-1 text-sm text-slate-500">Quản lý mã giảm giá và trạng thái kích hoạt.</p>
        </div>
        <button onClick={() => { setEditing(null); setModalOpen(true); }} className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
          <Plus className="h-4 w-4" />
          Tạo voucher
        </button>
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row">
        <input value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && void loadVouchers()} placeholder="Tìm theo mã voucher" className="admin-input sm:max-w-xs" />
        <select value={status} onChange={(event) => setStatus(event.target.value)} className="admin-input sm:max-w-48">
          <option value="">Tất cả trạng thái</option>
          <option value="active">Hoạt động</option>
          <option value="inactive">Không hoạt động</option>
        </select>
        <button onClick={() => void loadVouchers()} className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
          Tìm kiếm
        </button>
      </div>

      <AdminTable
        data={vouchers}
        loading={loading}
        keyExtractor={(row) => row.id}
        columns={[
          { key: 'code', label: 'Mã', render: (row) => <span className="font-semibold text-slate-900">{row.code}</span> },
          { key: 'type', label: 'Loại', render: (row) => row.discount_type === 'percent' ? 'Phần trăm' : 'Cố định' },
          { key: 'value', label: 'Giá trị', render: (row) => row.discount_type === 'fixed' ? formatCurrency(row.discount_value) : `${row.discount_value}%` },
          { key: 'min', label: 'Đơn tối thiểu', render: (row) => formatCurrency(row.min_order_value) },
          { key: 'usage', label: 'Đã dùng/Tổng', render: (row) => `${row.used_count}/${row.quantity}` },
          { key: 'status', label: 'Trạng thái', render: (row) => <StatusBadge status={displayStatus(row)} /> },
          {
            key: 'actions',
            label: '',
            className: 'text-right',
            render: (row) => (
              <div className="flex justify-end gap-2">
                <button onClick={() => void toggleStatus(row)} className="rounded-md px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100">
                  {row.status === 'active' ? 'Tắt' : 'Bật'}
                </button>
                <button onClick={() => { setEditing(row); setModalOpen(true); }} className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-950">
                  <Edit className="h-4 w-4" />
                </button>
                <button onClick={() => setDeleting(row)} className="rounded-md p-2 text-red-500 hover:bg-red-50">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ),
          },
        ]}
      />

      <VoucherModal open={modalOpen} voucher={editing} loading={saving} onClose={() => setModalOpen(false)} onSubmit={submitVoucher} />
      <ConfirmDialog open={!!deleting} title="Xóa voucher" message={`Xóa voucher "${deleting?.code ?? ''}"?`} danger loading={saving} onCancel={() => setDeleting(null)} onConfirm={deleteVoucher} />
    </div>
  );
}

function StatusBadge({ status }: { status: 'active' | 'inactive' | 'expired' }) {
  const classes = {
    active: 'bg-emerald-100 text-emerald-700',
    inactive: 'bg-slate-100 text-slate-600',
    expired: 'bg-red-100 text-red-700',
  };
  const labels = {
    active: 'Hoạt động',
    inactive: 'Không hoạt động',
    expired: 'Hết hạn',
  };
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${classes[status]}`}>{labels[status]}</span>;
}
