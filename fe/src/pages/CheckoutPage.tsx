import { AlertCircle, BadgePercent, ChevronRight, CreditCard, Loader2, Tag, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { orderService } from '@/services/orderService';
import { voucherService } from '@/services/voucherService';
import type { PaymentMethod } from '@/types/order';
import type { Voucher } from '@/types/voucher';
import { formatCurrency } from '@/utils/formatCurrency';
import { PATHS } from '@/utils/routePaths';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, clearCart } = useCart();

  // Form state
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [note, setNote] = useState('');

  // Voucher state
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherResult, setVoucherResult] = useState<Voucher | null>(null);
  const [voucherError, setVoucherError] = useState<string | null>(null);
  const [applyingVoucher, setApplyingVoucher] = useState(false);

  // Submit state
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Redirect if cart is empty
  useEffect(() => {
    if (cart && cart.items.length === 0) navigate(PATHS.CART, { replace: true });
  }, [cart, navigate]);

  if (!cart || cart.items.length === 0) return null;

  const subtotal = cart.total_price;
  const discount = voucherResult?.discount_amount ?? 0;
  const finalTotal = voucherResult?.final_total ?? subtotal;

  /* ── Apply Voucher ──────────────────────────────────── */
  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) return;
    setApplyingVoucher(true);
    setVoucherError(null);
    setVoucherResult(null);
    try {
      const result = await voucherService.applyVoucher({
        code: voucherCode.trim().toUpperCase(),
        order_total: subtotal,
      });
      setVoucherResult(result);
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? 'Mã giảm giá không hợp lệ.';
      setVoucherError(msg);
    } finally {
      setApplyingVoucher(false);
    }
  };

  const handleRemoveVoucher = () => {
    setVoucherResult(null);
    setVoucherCode('');
    setVoucherError(null);
  };

  /* ── Place Order ────────────────────────────────────── */
  const handlePlaceOrder = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const shippingName = user?.name?.trim() ?? '';
      const shippingPhone = user?.phone?.trim() ?? '';
      const shippingAddress = user?.address?.trim() ?? '';

      if (!shippingName || !shippingPhone || !shippingAddress) {
        setSubmitError('Vui lòng cập nhật đầy đủ họ tên, số điện thoại và địa chỉ giao hàng.');
        return;
      }

      const result = await orderService.createOrder({
        payment_method: paymentMethod,
        voucher_code: voucherResult?.code || undefined,
        note: note.trim() || undefined,
        shipping_name: shippingName,
        shipping_phone: shippingPhone,
        shipping_address: shippingAddress,
      });

      if (result.payment_url) {
        window.location.href = result.payment_url;
        return;
      }

      await clearCart();
      navigate(PATHS.ORDER_SUCCESS, { state: { order: result.order }, replace: true });
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? 'Có lỗi xảy ra. Vui lòng thử lại.';
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
      <h1 className="text-3xl md:text-4xl font-serif text-on-surface mb-10">Thanh toán</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">

        {/* ── Left: Form (3/5) ──────────────────────────── */}
        <div className="lg:col-span-3 space-y-6">

          {/* 1. Thông tin giao hàng */}
          <Section title="1. Thông tin giao hàng" icon={<Truck className="w-5 h-5" />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Họ tên">
                <input
                  readOnly
                  value={user?.name ?? ''}
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface text-sm focus:outline-none cursor-default"
                />
              </Field>
              <Field label="Email">
                <input
                  readOnly
                  value={user?.email ?? ''}
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface text-sm focus:outline-none cursor-default"
                />
              </Field>
              <Field label="Số điện thoại">
                <input
                  readOnly
                  value={user?.phone ?? 'Chưa cập nhật'}
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface text-sm focus:outline-none cursor-default"
                />
              </Field>
              <Field label="Địa chỉ giao hàng">
                <input
                  readOnly
                  value={user?.address ?? 'Chưa cập nhật'}
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface text-sm focus:outline-none cursor-default"
                />
              </Field>
            </div>
            <p className="text-xs text-on-surface-variant mt-3">
              Thông tin từ tài khoản của bạn.{' '}
              <a href={PATHS.PROFILE} className="text-primary hover:underline">Cập nhật hồ sơ</a> nếu cần thay đổi.
            </p>
          </Section>

          {/* 2. Phương thức thanh toán */}
          <Section title="2. Phương thức thanh toán" icon={<CreditCard className="w-5 h-5" />}>
            <div className="space-y-3">
              <PaymentOption
                id="cod"
                value="cod"
                selected={paymentMethod === 'cod'}
                onChange={() => setPaymentMethod('cod')}
                title="Thanh toán khi nhận hàng (COD)"
                description="Bạn thanh toán bằng tiền mặt khi nhận được hàng."
              />
              <PaymentOption
                id="banking"
                value="banking"
                selected={paymentMethod === 'banking'}
                onChange={() => setPaymentMethod('banking')}
                title="Chuyển khoản ngân hàng"
                description="Chuyển khoản trước, đơn hàng xử lý sau khi xác nhận thanh toán."
              />
              <PaymentOption
                id="vnpay"
                value="vnpay"
                selected={paymentMethod === 'vnpay'}
                onChange={() => setPaymentMethod('vnpay')}
                title="VNPay"
                description="Thanh toán qua VNPay bằng thẻ ATM, Visa hoặc QR."
              />
              <PaymentOption
                id="momo"
                value="momo"
                selected={paymentMethod === 'momo'}
                onChange={() => setPaymentMethod('momo')}
                title="Ví MoMo"
                description="Thanh toán bằng ví điện tử MoMo."
              />
            </div>
          </Section>

          {/* 3. Ghi chú */}
          <Section title="3. Ghi chú đơn hàng" icon={<ChevronRight className="w-5 h-5" />}>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ví dụ: Giao trong giờ hành chính, gọi trước khi giao..."
              className="w-full px-4 py-3 rounded-xl border border-outline-variant text-sm text-on-surface focus:outline-none focus:border-primary resize-none transition-colors"
            />
          </Section>
        </div>

        {/* ── Right: Summary (2/5) ──────────────────────── */}
        <div className="lg:col-span-2 space-y-5 sticky top-28">

          {/* Order summary */}
          <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/10 overflow-hidden">
            <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant/10">
              <h2 className="font-serif text-lg text-on-surface">Tóm tắt đơn hàng</h2>
            </div>

            {/* Items */}
            <div className="px-6 py-4 space-y-3 max-h-56 overflow-y-auto border-b border-outline-variant/10">
              {cart.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center gap-3 text-sm">
                  <span className="text-on-surface line-clamp-1 flex-1">{item.name} <span className="text-on-surface-variant">×{item.quantity}</span></span>
                  <span className="font-medium text-on-surface flex-shrink-0">{formatCurrency(item.subtotal)}</span>
                </div>
              ))}
            </div>

            {/* Voucher input */}
            <div className="px-6 py-4 border-b border-outline-variant/10">
              <p className="text-xs uppercase tracking-widest text-on-surface-variant font-sans mb-3 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" /> Mã giảm giá
              </p>
              {voucherResult ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-2.5">
                  <div>
                    <p className="text-sm font-bold text-green-700 flex items-center gap-1.5">
                      <BadgePercent className="w-4 h-4" /> {voucherResult.code}
                    </p>
                    <p className="text-xs text-green-600">Giảm {formatCurrency(voucherResult.discount_amount)}</p>
                  </div>
                  <button onClick={handleRemoveVoucher} className="text-xs text-red-500 hover:underline">Bỏ</button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={voucherCode}
                    onChange={(e) => { setVoucherCode(e.target.value.toUpperCase()); setVoucherError(null); }}
                    onKeyDown={(e) => e.key === 'Enter' && handleApplyVoucher()}
                    placeholder="Nhập mã..."
                    maxLength={30}
                    className="flex-1 px-3 py-2 rounded-xl border border-outline-variant text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                  <button
                    onClick={handleApplyVoucher}
                    disabled={applyingVoucher || !voucherCode.trim()}
                    className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-1.5"
                  >
                    {applyingVoucher ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Áp dụng'}
                  </button>
                </div>
              )}
              {voucherError && (
                <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {voucherError}
                </p>
              )}
            </div>

            {/* Totals */}
            <div className="px-6 py-4 space-y-2.5">
              <div className="flex justify-between text-sm text-on-surface-variant">
                <span>Tạm tính</span>
                <span className="text-on-surface font-medium">{formatCurrency(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-on-surface-variant">
                  <span>Giảm giá</span>
                  <span className="text-green-600 font-medium">-{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-on-surface-variant">
                <span>Phí vận chuyển</span>
                <span className="text-green-600 font-medium">Miễn phí</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-outline-variant/20">
                <span className="font-bold text-on-surface">Tổng thanh toán</span>
                <span className="text-2xl font-bold text-primary">{formatCurrency(finalTotal)}</span>
              </div>
            </div>
          </div>

          {/* Error */}
          {submitError && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Place order button */}
          <button
            onClick={handlePlaceOrder}
            disabled={submitting}
            className="w-full bg-primary text-white py-4 px-6 rounded-xl font-bold text-lg hover:opacity-90 transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {submitting ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Đang xử lý...</>
            ) : (
              <>Đặt hàng – {formatCurrency(finalTotal)}</>
            )}
          </button>
          <p className="text-xs text-on-surface-variant text-center">
            Bằng cách đặt hàng, bạn đồng ý với điều khoản dịch vụ của chúng tôi.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Helper sub-components ──────────────────────────── */
function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/10 overflow-hidden">
      <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant/10 flex items-center gap-2">
        <span className="text-primary">{icon}</span>
        <h2 className="font-serif text-lg text-on-surface">{title}</h2>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-on-surface-variant mb-1.5 uppercase tracking-widest font-sans">{label}</label>
      {children}
    </div>
  );
}

function PaymentOption({ id, value, selected, onChange, title, description }: {
  id: string; value: string; selected: boolean; onChange: () => void;
  title: string; description: string;
}) {
  return (
    <label
      htmlFor={id}
      className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
        selected ? 'border-primary bg-primary/5' : 'border-outline-variant hover:border-primary/40'
      }`}
    >
      <input
        id={id}
        type="radio"
        name="payment_method"
        value={value}
        checked={selected}
        onChange={onChange}
        className="mt-0.5 accent-primary"
      />
      <div>
        <p className="font-medium text-on-surface text-sm">{title}</p>
        <p className="text-xs text-on-surface-variant mt-0.5">{description}</p>
      </div>
    </label>
  );
}
