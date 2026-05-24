import type { ReactNode } from 'react';
import type { AdminOrder } from '@/types/admin';
import type { OrderStatus } from '@/types/order';
import { formatCurrency } from '@/utils/formatCurrency';

type OrderDetailModalProps = {
  order: AdminOrder | null;
  loading?: boolean;
  updating?: boolean;
  onClose: () => void;
  onUpdateStatus: (status: OrderStatus) => void;
};

const transitions: Record<OrderStatus, OrderStatus[]> = {
  pending: ['confirmed', 'cancelled'],
  processing: ['confirmed', 'cancelled'],
  confirmed: ['shipping', 'cancelled'],
  shipping: ['delivered'],
  delivered: [],
  cancelled: [],
};

const statusLabels: Record<OrderStatus, string> = {
  pending: 'Chờ xác nhận',
  processing: 'Đang xử lý',
  confirmed: 'Đã xác nhận',
  shipping: 'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã hủy',
};

function formatPayment(method?: string, status?: string) {
  const methodLabels: Record<string, string> = {
    cod: 'COD',
    banking: 'Chuyển khoản',
    vnpay: 'VNPay',
    momo: 'MoMo',
  };
  const paymentStatusLabels: Record<string, string> = {
    unpaid: 'Chưa thanh toán',
    pending: 'Chờ thanh toán',
    paid: 'Đã thanh toán',
    failed: 'Thất bại',
    cancelled: 'Đã hủy',
    expired: 'Hết hạn',
    refunded: 'Đã hoàn tiền',
  };

  const safeMethod = method ? methodLabels[method.toLowerCase()] ?? method : 'Không rõ';
  const safeStatus = status ? paymentStatusLabels[status.toLowerCase()] ?? status : 'Không rõ';

  return `${safeMethod} / ${safeStatus}`;
}

export default function OrderDetailModal({
  order,
  loading = false,
  updating = false,
  onClose,
  onUpdateStatus,
}: OrderDetailModalProps) {
  if (!order) return null;
  const nextStatuses = transitions[order.status] ?? [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-950">Đơn hàng #{order.id}</h2>
            <p className="mt-1 text-sm text-slate-500">{order.created_at}</p>
          </div>
          <button onClick={onClose} className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">
            Đóng
          </button>
        </div>

        {loading ? (
          <div className="p-5 text-sm text-slate-500">Đang tải chi tiết...</div>
        ) : (
          <div className="space-y-5 p-5">
            <div className="grid gap-4 md:grid-cols-2">
              <InfoBlock title="Khách hàng">
                <p>{order.user?.name ?? order.shipping_name ?? 'Khách hàng'}</p>
                <p>{order.user?.email}</p>
                <p>{order.shipping_phone}</p>
              </InfoBlock>
              <InfoBlock title="Giao hàng">
                <p>{order.shipping_name}</p>
                <p>{order.shipping_address}</p>
                <p>
                  Thanh toán:{' '}
                  {formatPayment(order.payment_method, order.payment_status)}
                </p>
              </InfoBlock>
            </div>

            <div className="rounded-md border border-slate-200">
              <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                Sản phẩm
              </div>
              <div className="divide-y divide-slate-100">
                {order.items?.map((item) => (
                  <div key={`${item.product_id}-${item.product_name}`} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                    <div>
                      <p className="font-medium text-slate-900">{item.product_name}</p>
                      <p className="text-slate-500">SL: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-slate-900">{formatCurrency(item.subtotal)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4 rounded-md bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-slate-500">Trạng thái hiện tại</p>
                <p className="font-semibold text-slate-950">{statusLabels[order.status]}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500">Tổng thanh toán</p>
                <p className="text-xl font-semibold text-slate-950">{formatCurrency(order.final_price)}</p>
              </div>
            </div>

            {nextStatuses.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {nextStatuses.map((status) => (
                  <button
                    key={status}
                    disabled={updating}
                    onClick={() => onUpdateStatus(status)}
                    className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                  >
                    Chuyển sang {statusLabels[status]}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-md border border-slate-200 p-4 text-sm text-slate-600">
      <p className="mb-2 font-semibold text-slate-950">{title}</p>
      <div className="space-y-1">{children}</div>
    </div>
  );
}
