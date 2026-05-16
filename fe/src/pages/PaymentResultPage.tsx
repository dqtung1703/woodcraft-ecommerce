import { AlertCircle, CheckCircle2, Clock, Loader2, PackageSearch, RefreshCw, XCircle } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { orderService } from '@/services/orderService';
import { paymentService } from '@/services/paymentService';
import type { PaymentStatus, PaymentStatusResponse } from '@/types/order';
import { PATHS, toOrderDetail } from '@/utils/routePaths';

type ResultState = 'loading' | 'success' | 'failed' | 'pending';

function decodeExtraData(value: string): { oid?: number } | null {
  try {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(normalized));
  } catch {
    return null;
  }
}

function getOrderId(gateway: string | undefined, searchParams: URLSearchParams): number | null {
  if (gateway === 'vnpay') {
    const txnRef = searchParams.get('vnp_TxnRef');
    const parsed = txnRef ? Number.parseInt(txnRef.split('_')[0] ?? '', 10) : Number.NaN;
    return Number.isFinite(parsed) ? parsed : null;
  }

  if (gateway === 'momo') {
    const extraData = searchParams.get('extraData');
    const orderId = extraData ? decodeExtraData(extraData)?.oid : null;
    if (typeof orderId === 'number' && Number.isFinite(orderId)) {
      return orderId;
    }

    const momoOrderId = searchParams.get('orderId');
    const parsed = momoOrderId ? Number.parseInt(momoOrderId.replace(/^WC/i, '').split('_')[0] ?? '', 10) : Number.NaN;
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function isFailedStatus(status: PaymentStatus) {
  return status === 'failed' || status === 'cancelled' || status === 'expired' || status === 'refunded';
}

export default function PaymentResultPage() {
  const { gateway } = useParams<{ gateway: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();

  const queryString = searchParams.toString();
  const parsedOrderId = useMemo(() => getOrderId(gateway, searchParams), [gateway, queryString]);
  const returnPayload = useMemo(() => Object.fromEntries(searchParams.entries()), [queryString]);
  const [orderId, setOrderId] = useState<number | null>(parsedOrderId);
  const [status, setStatus] = useState<ResultState>('loading');
  const [payment, setPayment] = useState<PaymentStatusResponse | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    setOrderId(parsedOrderId);
  }, [parsedOrderId]);

  useEffect(() => {
    let cancelled = false;

    const pollStatus = async () => {
      if (!parsedOrderId) {
        setStatus('failed');
        return;
      }

      if (gateway) {
        if (Object.keys(returnPayload).length > 0) {
          try {
            await paymentService.confirmReturn(gateway, returnPayload);
          } catch {
            // IPN may still update the order. Continue polling the trusted DB status.
          }
        }
      }

      for (let attempt = 0; attempt < 5; attempt += 1) {
        try {
          const data = await paymentService.getStatus(parsedOrderId);
          if (cancelled) return;

          setPayment(data);

          if (data.payment_status === 'paid') {
            await clearCart();
            if (!cancelled) setStatus('success');
            return;
          }

          if (isFailedStatus(data.payment_status)) {
            setStatus('failed');
            return;
          }
        } catch {
          if (!cancelled) setStatus('failed');
          return;
        }

        await new Promise((resolve) => setTimeout(resolve, 1500));
      }

      if (!cancelled) setStatus('pending');
    };

    pollStatus();

    return () => {
      cancelled = true;
    };
  }, [clearCart, gateway, parsedOrderId, returnPayload]);

  const handleRetry = useCallback(async () => {
    if (!orderId) return;

    setIsRetrying(true);
    setActionError(null);

    try {
      const result = await orderService.retryPayment(orderId);
      window.location.href = result.payment_url;
    } catch (err: unknown) {
      setActionError((err as { message?: string })?.message ?? 'Không thể tạo lại liên kết thanh toán.');
      setIsRetrying(false);
    }
  }, [orderId]);

  const handleCancel = useCallback(async () => {
    if (!orderId) return;

    setIsCancelling(true);
    setActionError(null);

    try {
      await orderService.cancelOrder(orderId);
      navigate(toOrderDetail(orderId), { replace: true });
    } catch (err: unknown) {
      setActionError((err as { message?: string })?.message ?? 'Không thể hủy đơn hàng.');
      setIsCancelling(false);
    }
  }, [navigate, orderId]);

  const title = {
    loading: 'Đang xác nhận thanh toán',
    success: 'Thanh toán thành công',
    failed: 'Thanh toán chưa hoàn tất',
    pending: 'Giao dịch đang xử lý',
  }[status];

  const description = {
    loading: 'Vui lòng giữ nguyên trang trong giây lát.',
    success: 'Đơn hàng đã được ghi nhận và chuyển sang xử lý.',
    failed: 'Bạn có thể thử thanh toán lại hoặc hủy đơn hàng.',
    pending: 'Kết quả thanh toán chưa sẵn sàng. Bạn có thể kiểm tra lại trong chi tiết đơn.',
  }[status];

  return (
    <div className="max-w-2xl mx-auto px-6 md:px-12 py-20">
      <div className="bg-white border border-outline-variant/20 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-10 text-center">
          <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center bg-surface-container-low">
            {status === 'loading' && <Loader2 className="w-10 h-10 text-primary animate-spin" />}
            {status === 'success' && <CheckCircle2 className="w-10 h-10 text-green-600" />}
            {status === 'failed' && <XCircle className="w-10 h-10 text-red-500" />}
            {status === 'pending' && <Clock className="w-10 h-10 text-amber-600" />}
          </div>

          <h1 className="text-3xl font-serif text-on-surface mb-3">{title}</h1>
          <p className="text-on-surface-variant text-sm leading-relaxed max-w-md mx-auto">{description}</p>

          {payment && (
            <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
              <Info label="Đơn hàng" value={`#${payment.order_id}`} />
              <Info label="Thanh toán" value={payment.payment_status} />
              <Info label="Cổng" value={payment.payment_method.toUpperCase()} />
            </div>
          )}

          {actionError && (
            <div className="mt-6 flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 text-left">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{actionError}</span>
            </div>
          )}
        </div>

        <div className="px-6 py-5 bg-surface-container-low border-t border-outline-variant/10 flex flex-col sm:flex-row gap-3">
          {status === 'success' && orderId && (
            <Link
              to={toOrderDetail(orderId)}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-white px-5 py-3 rounded-xl font-bold hover:opacity-90 transition-all"
            >
              <PackageSearch className="w-5 h-5" /> Xem đơn hàng
            </Link>
          )}

          {(status === 'failed' || status === 'pending') && orderId && (
            <>
              <button
                onClick={handleRetry}
                disabled={isRetrying || isCancelling}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-white px-5 py-3 rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-60"
              >
                {isRetrying ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
                Thử lại
              </button>
              <button
                onClick={handleCancel}
                disabled={isRetrying || isCancelling}
                className="flex-1 inline-flex items-center justify-center gap-2 border border-red-300 text-red-600 px-5 py-3 rounded-xl font-bold hover:bg-red-50 transition-all disabled:opacity-60"
              >
                {isCancelling ? <Loader2 className="w-5 h-5 animate-spin" /> : <XCircle className="w-5 h-5" />}
                Hủy đơn
              </button>
            </>
          )}

          <Link
            to={PATHS.ORDERS}
            className="flex-1 inline-flex items-center justify-center gap-2 border border-outline-variant text-on-surface px-5 py-3 rounded-xl font-medium hover:bg-white transition-all"
          >
            Danh sách đơn
          </Link>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-outline-variant/20 bg-surface-container-low px-4 py-3">
      <p className="text-[11px] uppercase tracking-widest text-on-surface-variant mb-1">{label}</p>
      <p className="text-sm font-bold text-on-surface">{value}</p>
    </div>
  );
}
