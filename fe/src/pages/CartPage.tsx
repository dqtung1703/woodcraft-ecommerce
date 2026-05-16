import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useCart } from '@/contexts/CartContext';
import type { CartItem } from '@/types/cart';
import { formatCurrency } from '@/utils/formatCurrency';
import { PATHS } from '@/utils/routePaths';

export default function CartPage() {
  const { cart, isLoading, updateItem, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const isEmpty = !cart || cart.items.length === 0;

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
      <h1 className="text-3xl md:text-4xl font-serif text-on-surface mb-10">Giỏ hàng của bạn</h1>

      {isEmpty ? (
        /* ── Empty state ─────────────────────────────────────── */
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-6 text-center">
          <ShoppingBag className="w-20 h-20 text-outline-variant" strokeWidth={1} />
          <p className="text-xl font-serif text-on-surface-variant">Giỏ hàng đang trống</p>
          <p className="text-sm text-on-surface-variant">Hãy khám phá bộ sưu tập để thêm sản phẩm.</p>
          <Link
            to={PATHS.PRODUCTS}
            className="mt-2 bg-primary text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg"
          >
            Khám phá bộ sưu tập
          </Link>
        </div>
      ) : (
        /* ── Cart content ────────────────────────────────────── */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* Left – Item list */}
          <div className="lg:col-span-2 space-y-4">
            {/* Header row */}
            <div className="hidden md:grid grid-cols-12 gap-4 text-xs uppercase tracking-widest text-on-surface-variant font-sans pb-3 border-b border-outline-variant/40">
              <span className="col-span-6">Sản phẩm</span>
              <span className="col-span-2 text-center">Đơn giá</span>
              <span className="col-span-2 text-center">Số lượng</span>
              <span className="col-span-2 text-right">Thành tiền</span>
            </div>

            {cart.items.map((item: CartItem) => (
              <CartItemRow
                key={item.id}
                item={item}
                onUpdate={(qty) => updateItem(item.id, qty)}
                onRemove={() => removeItem(item.id)}
              />
            ))}

            {/* Clear cart */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => clearCart()}
                className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-red-500 transition-colors"
              >
                <X className="w-4 h-4" /> Xóa tất cả
              </button>
            </div>
          </div>

          {/* Right – Order summary */}
          <div className="bg-surface-container-low rounded-2xl p-8 sticky top-28 space-y-4">
            <h2 className="text-xl font-serif text-on-surface mb-2">Tóm tắt đơn hàng</h2>

            <div className="flex justify-between text-sm text-on-surface-variant">
              <span>Số lượng sản phẩm</span>
              <span className="font-medium text-on-surface">{cart.items_count}</span>
            </div>

            <div className="flex justify-between text-sm text-on-surface-variant">
              <span>Tạm tính</span>
              <span className="font-medium text-on-surface">{formatCurrency(cart.total_price)}</span>
            </div>

            <div className="flex justify-between text-sm text-on-surface-variant">
              <span>Phí vận chuyển</span>
              <span className="text-green-600 font-medium">Miễn phí</span>
            </div>

            <div className="border-t border-outline-variant/40 pt-4 flex justify-between items-center">
              <span className="font-bold text-on-surface">Tổng cộng</span>
              <span className="text-2xl font-bold text-primary">{formatCurrency(cart.total_price)}</span>
            </div>

            <button
              onClick={() => navigate(PATHS.CHECKOUT)}
              className="w-full bg-primary text-white py-3.5 px-6 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg mt-2"
            >
              Tiến hành thanh toán
            </button>

            <Link
              to={PATHS.PRODUCTS}
              className="block text-center text-sm text-on-surface-variant hover:text-primary transition-colors mt-1"
            >
              ← Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Cart Item Row component ─────────────────────────── */
type CartItemRowProps = {
  item: CartItem;
  onUpdate: (qty: number) => void;
  onRemove: () => void;
};

function CartItemRow({ item, onUpdate, onRemove }: CartItemRowProps) {
  return (
    <div className="grid grid-cols-12 gap-4 items-center bg-white rounded-2xl p-4 shadow-sm border border-outline-variant/10">
      {/* Image + name */}
      <div className="col-span-12 md:col-span-6 flex items-center gap-4">
        <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-surface-container-low">
          {item.image ? (
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 text-outline-variant" strokeWidth={1} />
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="font-serif text-on-surface line-clamp-2 leading-snug">{item.name}</p>
          <p className="text-xs text-on-surface-variant mt-1">{formatCurrency(item.final_price)} / chiếc</p>
        </div>
      </div>

      {/* Unit price */}
      <div className="hidden md:flex col-span-2 justify-center">
        <span className="text-sm font-medium text-on-surface">{formatCurrency(item.final_price)}</span>
      </div>

      {/* Quantity stepper */}
      <div className="col-span-8 md:col-span-2 flex items-center justify-center">
        <div className="flex items-center border border-outline-variant rounded-xl overflow-hidden">
          <button
            className="px-3 py-2 hover:bg-surface-container-low disabled:opacity-30 transition-colors"
            onClick={() => onUpdate(Math.max(1, item.quantity - 1))}
            disabled={item.quantity <= 1}
            aria-label="Giảm số lượng"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="px-4 py-2 font-medium min-w-[2.5rem] text-center text-sm">{item.quantity}</span>
          <button
            className="px-3 py-2 hover:bg-surface-container-low disabled:opacity-30 transition-colors"
            onClick={() => onUpdate(Math.min(item.stock, item.quantity + 1))}
            disabled={item.quantity >= item.stock}
            aria-label="Tăng số lượng"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Subtotal + remove */}
      <div className="col-span-4 md:col-span-2 flex items-center justify-end gap-3">
        <span className="font-bold text-primary text-sm">{formatCurrency(item.subtotal)}</span>
        <button
          onClick={onRemove}
          className="text-on-surface-variant hover:text-red-500 transition-colors p-1"
          aria-label="Xóa sản phẩm"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
