import { AlertCircle, ArrowLeft, CheckCircle2, Clock, CreditCard, Package, Truck, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ReviewModal from '@/components/ui/ReviewModal';
import { ApiError } from '@/services/apiClient';
import { orderService } from '@/services/orderService';
import type { Order, OrderStatus } from '@/types/order';
import { formatCurrency } from '@/utils/formatCurrency';
import { PATHS } from '@/utils/routePaths';
import { useToast } from '@/contexts/ToastContext';

// ── Types ─────────────────────────────────────────────────────────────────────

type ReviewedMap = Record<number, boolean>; // orderItemId → reviewed
type ReviewTarget = { itemId: number; productId: number; productName: string };

// ── Status helpers ────────────────────────────────────────────────────────────

const STATUS_LABEL: Partial<Record<OrderStatus, string>> = {
  pending:   'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  shipping:  'Đang giao hàng',
  delivered: 'Đã giao hàng',
  cancelled: 'Đã hủy',
};

const STATUS_BADGE: Partial<Record<OrderStatus, string>> = {
  pending:   'bg-amber-100 text-amber-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipping:  'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-700',
};

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  cod: 'Thanh toán khi nhận hàng (COD)',
  banking: 'Chuyển khoản ngân hàng',
  vnpay: 'VNPay',
  momo: 'Ví MoMo',
};

const PAYMENT_STATUS_LABEL: Record<string, string> = {
  unpaid: 'Chưa thanh toán',
  pending: 'Chờ thanh toán',
  paid: 'Đã thanh toán',
  failed: 'Thanh toán thất bại',
  cancelled: 'Đã hủy thanh toán',
  expired: 'Hết hạn thanh toán',
  refunded: 'Đã hoàn tiền',
};

const PAYMENT_STATUS_COLOR: Record<string, string> = {
  unpaid: 'text-amber-700',
  pending: 'text-amber-700',
  paid: 'text-green-700 font-medium',
  failed: 'text-red-600',
  cancelled: 'text-red-600',
  expired: 'text-red-600',
  refunded: 'text-purple-700',
};

// ── Timeline ──────────────────────────────────────────────────────────────────

const TIMELINE_STEPS: { key: OrderStatus; label: string; icon: React.ElementType }[] = [
  { key: 'pending',   label: 'Đặt hàng',    icon: Clock },
  { key: 'confirmed', label: 'Xác nhận',    icon: CheckCircle2 },
  { key: 'shipping',  label: 'Đang giao',   icon: Truck },
  { key: 'delivered', label: 'Đã giao',     icon: Package },
];

const ORDER_STATUS_INDEX: Partial<Record<OrderStatus, number>> = {
  pending:   0,
  confirmed: 1,
  shipping:  2,
  delivered: 3,
  cancelled: -1,
};

function OrderTimeline({ status }: { status: OrderStatus }) {
  const currentIdx = ORDER_STATUS_INDEX[status] ?? 0;

  if (status === 'cancelled') {
    return (
      <div className="flex items-center gap-3 p-4 bg-red-50 rounded-2xl border border-red-100">
        <XCircle className="w-5 h-5 text-red-500 shrink-0" />
        <span className="text-sm text-red-700 font-medium">Đơn hàng đã bị hủy</span>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-0">
      {TIMELINE_STEPS.map((step, idx) => {
        const isDone    = idx <= currentIdx;
        const isCurrent = idx === currentIdx;
        const Icon = step.icon;
        return (
          <div key={step.key} className="flex-1 flex flex-col items-center">
            {/* Connector + circle */}
            <div className="flex items-center w-full">
              {/* Left line */}
              {idx > 0 && (
                <div className={`flex-1 h-0.5 ${isDone ? 'bg-primary' : 'bg-outline-variant/40'}`} />
              )}
              {/* Circle */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                  isCurrent
                    ? 'bg-primary text-white ring-2 ring-primary/30'
                    : isDone
                    ? 'bg-primary text-white'
                    : 'bg-surface-container-high text-outline-variant'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              {/* Right line */}
              {idx < TIMELINE_STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 ${idx < currentIdx ? 'bg-primary' : 'bg-outline-variant/40'}`} />
              )}
            </div>
            {/* Label */}
            <span className={`text-[11px] mt-2 text-center leading-tight ${isCurrent ? 'text-primary font-semibold' : isDone ? 'text-on-surface-variant' : 'text-outline-variant'}`}>
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function OrderDetailSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-6 md:px-12 py-16 animate-pulse">
      <div className="h-4 w-24 bg-surface-container-high rounded mb-8" />
      <div className="h-8 w-48 bg-surface-container-highest rounded mb-2" />
      <div className="h-4 w-64 bg-surface-container-high rounded mb-10" />
      <div className="bg-white rounded-2xl border border-outline-variant/30 p-6 mb-4">
        <div className="h-8 w-full bg-surface-container-high rounded mb-6" />
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex gap-4 mb-4">
            <div className="w-20 h-20 bg-surface-container-high rounded-xl shrink-0" />
            <div className="flex-1 flex flex-col gap-2">
              <div className="h-4 w-3/4 bg-surface-container-high rounded" />
              <div className="h-3 w-1/2 bg-surface-container-high rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [order, setOrder]           = useState<Order | null>(null);
  const [isLoading, setIsLoading]   = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  // Map để track các item đã review (reset mỗi lần vào trang)
  const [reviewed, setReviewed]         = useState<ReviewedMap>({});
  const [activeReview, setActiveReview] = useState<ReviewTarget | null>(null);
  const toast = useToast();

  useEffect(() => {
    if (!id) return;
    orderService
      .getOrder(Number(id))
      .then(setOrder)
      .catch((err: unknown) => {
        if (err instanceof ApiError && err.status === 404) {
          setError('Không tìm thấy đơn hàng này.');
        } else {
          setError('Không thể tải chi tiết đơn hàng. Vui lòng thử lại.');
        }
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleCancelConfirmed = async () => {
    if (!order) return;
    setIsCancelling(true);
    setShowConfirm(false);
    try {
      await orderService.cancelOrder(order.id);
      setOrder((prev) => prev ? { ...prev, status: 'cancelled' } : prev);
      toast.success('Đơn hàng đã được hủy thành công.');
    } catch {
      toast.error('Không thể hủy đơn hàng. Vui lòng thử lại.');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleContinuePayment = async () => {
    if (!order) return;
    setIsPaying(true);
    try {
      const result = await orderService.retryPayment(order.id);
      window.location.href = result.payment_url;
    } catch {
      toast.error('Không thể tạo lại link thanh toán. Vui lòng thử lại.');
      setIsPaying(false);
    }
  };

  // Callback khi ReviewModal submit thành công
  const handleReviewed = (orderItemId: number) => {
    setReviewed((prev) => ({ ...prev, [orderItemId]: true }));
    setActiveReview(null);
  };

  // ── Render states ──────────────────────────────────────────────────────────

  if (isLoading) return <OrderDetailSkeleton />;

  if (error || !order) {
    return (
      <div className="max-w-3xl mx-auto px-6 md:px-12 py-16 text-center">
        <AlertCircle className="w-14 h-14 mx-auto mb-4 text-red-400" />
        <p className="text-red-600 font-medium mb-4">{error ?? 'Đã có lỗi xảy ra.'}</p>
        <button onClick={() => navigate(PATHS.ORDERS)} className="text-sm text-primary hover:underline">
          ← Quay lại danh sách
        </button>
      </div>
    );
  }

  const canCancel  = order.status === 'pending';
  const canContinuePayment =
    order.status === 'pending'
    && ['vnpay', 'momo'].includes(order.payment_method)
    && ['pending', 'failed', 'cancelled', 'expired'].includes(order.payment_status);
  const isDelivered = order.status === 'delivered';
  const hasDiscount = order.discount_amount > 0;

  return (
    <div className="max-w-3xl mx-auto px-6 md:px-12 py-16">
      {/* Back */}
      <Link
        to={PATHS.ORDERS}
        className="inline-flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-primary transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" /> Tất cả đơn hàng
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif text-on-surface">Đơn hàng #{order.id}</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Đặt ngày{' '}
            {new Date(order.created_at).toLocaleDateString('vi-VN', {
              day: '2-digit', month: '2-digit', year: 'numeric',
            })}
          </p>
        </div>
        <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${STATUS_BADGE[order.status]}`}>
          {STATUS_LABEL[order.status]}
        </span>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-2xl border border-outline-variant/30 p-6 mb-4">
        <h2 className="text-sm font-semibold text-on-surface-variant uppercase tracking-widest mb-5">
          Trạng thái
        </h2>
        <OrderTimeline status={order.status} />
      </div>

      {/* Items */}
      <div className="bg-white rounded-2xl border border-outline-variant/30 p-6 mb-4">
        <h2 className="text-sm font-semibold text-on-surface-variant uppercase tracking-widest mb-5">
          Sản phẩm ({order.items_count})
        </h2>
        <ul className="flex flex-col divide-y divide-outline-variant/20">
          {order.items.map((item) => (
            <li key={item.id} className="py-4 first:pt-0 last:pb-0">
              <div className="flex gap-4 items-start">
                {/* Image */}
                <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-surface-container-low">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.product_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-6 h-6 text-outline-variant" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-on-surface text-sm leading-snug">{item.product_name}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {formatCurrency(item.price)} × {item.quantity}
                  </p>
                  <p className="text-sm font-semibold text-on-surface mt-1">
                    {formatCurrency(item.subtotal)}
                  </p>
                </div>

                {/* Review button (only when delivered) */}
                {isDelivered && (
                  <div className="shrink-0">
                    {reviewed[item.id] ? (
                      <span className="inline-flex items-center gap-1 text-xs text-green-700 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Đã đánh giá
                      </span>
                    ) : (
                      <button
                        onClick={() =>
                          setActiveReview({
                            itemId: item.id,
                            productId: item.product_id,
                            productName: item.product_name,
                          })
                        }
                        className="text-xs text-primary border border-primary/40 rounded-full px-3 py-1 hover:bg-primary/5 transition-colors"
                      >
                        Viết đánh giá
                      </button>
                    )}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Payment summary */}
      <div className="bg-white rounded-2xl border border-outline-variant/30 p-6 mb-4">
        <h2 className="text-sm font-semibold text-on-surface-variant uppercase tracking-widest mb-4">
          Thanh toán
        </h2>
        <dl className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-on-surface-variant">Tạm tính</dt>
            <dd className="text-on-surface">{formatCurrency(order.total_price)}</dd>
          </div>
          {hasDiscount && (
            <div className="flex justify-between">
              <dt className="text-on-surface-variant">
                Giảm giá{order.voucher_code ? ` (${order.voucher_code})` : ''}
              </dt>
              <dd className="text-green-700">- {formatCurrency(order.discount_amount)}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-on-surface-variant">Vận chuyển</dt>
            <dd className="text-green-700">Miễn phí</dd>
          </div>
          <div className="flex justify-between font-semibold text-base pt-2 border-t border-outline-variant/30">
            <dt className="text-on-surface">Tổng cộng</dt>
            <dd className="text-primary">{formatCurrency(order.final_price)}</dd>
          </div>
          <div className="flex justify-between mt-1">
            <dt className="text-on-surface-variant">Phương thức</dt>
            <dd className="text-on-surface">
              {PAYMENT_METHOD_LABEL[order.payment_method] ?? order.payment_method}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-on-surface-variant">Trạng thái TT</dt>
            <dd className={PAYMENT_STATUS_COLOR[order.payment_status] ?? 'text-amber-700'}>
              {PAYMENT_STATUS_LABEL[order.payment_status] ?? order.payment_status}
            </dd>
          </div>
        </dl>
      </div>

      {/* Actions */}
      {canCancel && (
        <div className="mt-2 space-y-3">
          {canContinuePayment && (
            <button
              onClick={handleContinuePayment}
              disabled={isPaying}
              className="w-full py-3 bg-primary text-white text-sm font-semibold rounded-full hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              {isPaying ? 'Đang tạo link thanh toán...' : 'Tiếp tục thanh toán'}
            </button>
          )}

          <button
            onClick={() => setShowConfirm(true)}
            disabled={isCancelling}
            className="w-full py-3 border border-red-300 text-red-600 text-sm font-medium rounded-full hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCancelling ? 'Đang hủy đơn…' : 'Hủy đơn hàng'}
          </button>
        </div>
      )}

      {/* Confirm dialog */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-cancel-title"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <h3 id="confirm-cancel-title" className="font-serif text-lg text-on-surface mb-2">
              Xác nhận hủy đơn?
            </h3>
            <p className="text-sm text-on-surface-variant mb-6">
              Hành động này sẽ hoàn lại kho hàng và hủy mã giảm giá (nếu có). Không thể hoàn tác.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 border border-outline-variant/50 rounded-full text-sm text-on-surface-variant hover:bg-surface-container-low transition-colors"
              >
                Giữ lại
              </button>
              <button
                onClick={handleCancelConfirmed}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-full text-sm font-medium hover:bg-red-600 transition-colors"
              >
                Hủy đơn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {activeReview && (
        <ReviewModal
          productId={activeReview.productId}
          productName={activeReview.productName}
          onSuccess={() => handleReviewed(activeReview.itemId)}
          onClose={() => setActiveReview(null)}
        />
      )}
    </div>
  );
}
