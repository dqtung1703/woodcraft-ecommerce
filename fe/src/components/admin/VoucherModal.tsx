import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { AdminVoucher, CreateVoucherPayload, UpdateVoucherPayload } from '@/types/admin';

type VoucherModalProps = {
  open: boolean;
  voucher?: AdminVoucher | null;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (data: CreateVoucherPayload | UpdateVoucherPayload) => void;
};

type VoucherFormState = {
  code: string;
  discount_type: 'percent' | 'fixed';
  discount_value: string;
  min_order_value: string;
  max_discount: string;
  quantity: string;
  per_user_limit: string;
  start_date: string;
  end_date: string;
};

const emptyForm: VoucherFormState = {
  code: '',
  discount_type: 'percent' as const,
  discount_value: '',
  min_order_value: '0',
  max_discount: '',
  quantity: '1',
  per_user_limit: '',
  start_date: '',
  end_date: '',
};

export default function VoucherModal({ open, voucher, loading = false, onClose, onSubmit }: VoucherModalProps) {
  const [form, setForm] = useState<VoucherFormState>(emptyForm);

  useEffect(() => {
    if (!open) return;
    setForm(voucher ? {
      code: voucher.code,
      discount_type: voucher.discount_type,
      discount_value: String(voucher.discount_value),
      min_order_value: String(voucher.min_order_value),
      max_discount: voucher.max_discount === null ? '' : String(voucher.max_discount),
      quantity: String(voucher.quantity),
      per_user_limit: voucher.per_user_limit === null ? '' : String(voucher.per_user_limit),
      start_date: voucher.start_date?.slice(0, 10) ?? '',
      end_date: voucher.end_date?.slice(0, 10) ?? '',
    } : emptyForm);
  }, [open, voucher]);

  if (!open) return null;

  const setField = (key: keyof VoucherFormState, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const payload: CreateVoucherPayload = {
    code: form.code.trim().toUpperCase(),
    discount_type: form.discount_type,
    discount_value: Number(form.discount_value),
    min_order_value: Number(form.min_order_value || 0),
    max_discount: form.max_discount ? Number(form.max_discount) : null,
    quantity: Number(form.quantity),
    per_user_limit: form.per_user_limit ? Number(form.per_user_limit) : null,
    start_date: form.start_date || null,
    end_date: form.end_date || null,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm">
      <form
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(payload);
        }}
      >
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-950">
            {voucher ? 'Sửa voucher' : 'Tạo voucher'}
          </h2>
        </div>

        <div className="grid gap-4 px-5 py-4 sm:grid-cols-2">
          <Field label="Mã voucher">
            <input className="admin-input" value={form.code} onChange={(event) => setField('code', event.target.value)} required />
          </Field>
          <Field label="Loại giảm">
            <select className="admin-input" value={form.discount_type} onChange={(event) => setField('discount_type', event.target.value)}>
              <option value="percent">Phần trăm</option>
              <option value="fixed">Số tiền</option>
            </select>
          </Field>
          <Field label="Giá trị giảm">
            <input className="admin-input" type="number" min="0" value={form.discount_value} onChange={(event) => setField('discount_value', event.target.value)} required />
          </Field>
          <Field label="Đơn tối thiểu">
            <input className="admin-input" type="number" min="0" value={form.min_order_value} onChange={(event) => setField('min_order_value', event.target.value)} required />
          </Field>
          <Field label="Giảm tối đa">
            <input className="admin-input" type="number" min="0" value={form.max_discount} onChange={(event) => setField('max_discount', event.target.value)} />
          </Field>
          <Field label="Số lượng">
            <input className="admin-input" type="number" min="1" value={form.quantity} onChange={(event) => setField('quantity', event.target.value)} required />
          </Field>
          <Field label="Giới hạn mỗi khách">
            <input className="admin-input" type="number" min="1" value={form.per_user_limit} onChange={(event) => setField('per_user_limit', event.target.value)} />
          </Field>
          <Field label="Ngày bắt đầu">
            <input className="admin-input" type="date" value={form.start_date} onChange={(event) => setField('start_date', event.target.value)} />
          </Field>
          <Field label="Ngày kết thúc">
            <input className="admin-input" type="date" value={form.end_date} onChange={(event) => setField('end_date', event.target.value)} />
          </Field>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 px-5 py-4">
          <button type="button" onClick={onClose} disabled={loading} className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60">
            Hủy
          </button>
          <button type="submit" disabled={loading} className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60">
            {loading ? 'Đang lưu...' : 'Lưu'}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
