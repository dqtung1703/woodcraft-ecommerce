import { CheckCircle, ChevronRight, Copy, Package, ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import type { Order } from '@/types/order';
import { formatCurrency } from '@/utils/formatCurrency';
import { PATHS } from '@/utils/routePaths';

export default function OrderSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order as Order | undefined;
  const [copied, setCopied] = useState(false);

  // Redirect nếu không có order state (truy cập thẳng URL)
  useEffect(() => {
    if (!order) navigate(PATHS.HOME, { replace: true });
  }, [order, navigate]);

  if (!order) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(String(order.id)).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusColor: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    shipping: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-600',
  };

  return (
    <div className="max-w-2xl mx-auto px-6 md:px-12 py-20">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl md:text-4xl font-serif text-on-surface mb-3">Đặt hàng thành công!</h1>
        <p className="text-on-surface-variant">
          Cảm ơn bạn đã tin tưởng Chuyên Mỹ Artisan. Chúng tôi sẽ xử lý đơn hàng của bạn sớm nhất có thể.
        </p>
      </div>

      {/* Order info card */}
      <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/10 overflow-hidden mb-6">
        {/* Order ID header */}
        <div className="bg-surface-container-low px-6 py-5 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-on-surface-variant font-sans mb-1">Mã đơn hàng</p>
            <p className="text-2xl font-bold text-primary">#{order.id}</p>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-surface-container"
            aria-label="Sao chép mã đơn"
          >
            <Copy className="w-4 h-4" />
            {copied ? 'Đã sao chép!' : 'Sao chép'}
          </button>
        </div>

        {/* Order details */}
        <div className="px-6 py-5 space-y-3 border-b border-outline-variant/10">
          <Row label="Trạng thái">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusColor[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
              {order.status_label}
            </span>
          </Row>
          <Row label="Hình thức thanh toán">
            {order.payment_method === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : 'Chuyển khoản ngân hàng'}
          </Row>
          {order.voucher_code && <Row label="Mã giảm giá">{order.voucher_code}</Row>}
          {order.note && <Row label="Ghi chú">{order.note}</Row>}
          <Row label="Ngày đặt">{new Date(order.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</Row>
        </div>

        {/* Items */}
        {order.items && order.items.length > 0 && (
          <div className="px-6 py-5 space-y-3 border-b border-outline-variant/10">
            <p className="text-xs uppercase tracking-widest text-on-surface-variant font-sans mb-3">Sản phẩm đã đặt</p>
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-surface-container-low">
                  {item.image
                    ? <img src={item.image} alt={item.product_name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center"><ShoppingBag className="w-5 h-5 text-outline-variant" strokeWidth={1} /></div>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-on-surface line-clamp-1">{item.product_name}</p>
                  <p className="text-xs text-on-surface-variant">x{item.quantity}</p>
                </div>
                <span className="text-sm font-bold text-primary flex-shrink-0">{formatCurrency(item.subtotal)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Price summary */}
        <div className="px-6 py-5 space-y-2.5">
          <Row label="Tạm tính">{formatCurrency(order.total_price)}</Row>
          {order.discount_amount > 0 && (
            <Row label="Giảm giá"><span className="text-green-600">-{formatCurrency(order.discount_amount)}</span></Row>
          )}
          <Row label="Phí vận chuyển"><span className="text-green-600">Miễn phí</span></Row>
          <div className="flex justify-between items-center pt-3 border-t border-outline-variant/20">
            <span className="font-bold text-on-surface">Tổng thanh toán</span>
            <span className="text-xl font-bold text-primary">{formatCurrency(order.final_price)}</span>
          </div>
        </div>
      </div>

      {/* Banking info */}
      {order.payment_method === 'banking' && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6">
          <p className="font-bold text-blue-800 mb-2">Thông tin chuyển khoản</p>
          <p className="text-sm text-blue-700 leading-relaxed">
            Vui lòng chuyển khoản <strong>{formatCurrency(order.final_price)}</strong> đến tài khoản:<br />
            <strong>Ngân hàng:</strong> VietcomBank – CN Hà Nội<br />
            <strong>Số tài khoản:</strong> 1234567890<br />
            <strong>Chủ tài khoản:</strong> Đồ Gỗ Khảm Trai Chuyên Mỹ<br />
            <strong>Nội dung:</strong> DH{order.id}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to={`/orders/${order.id}`}
          className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-3.5 px-6 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg"
        >
          <Package className="w-5 h-5" /> Xem chi tiết đơn hàng
        </Link>
        <Link
          to={PATHS.PRODUCTS}
          className="flex-1 flex items-center justify-center gap-2 border border-outline-variant text-on-surface py-3.5 px-6 rounded-xl font-medium hover:bg-surface-container-low transition-colors"
        >
          <ChevronRight className="w-5 h-5" /> Tiếp tục mua sắm
        </Link>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between items-start gap-4">
      <span className="text-sm text-on-surface-variant flex-shrink-0">{label}</span>
      <span className="text-sm font-medium text-on-surface text-right">{children}</span>
    </div>
  );
}
