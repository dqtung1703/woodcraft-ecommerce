import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { cartService } from '@/services/cartService';
import type { Cart, CartItem } from '@/types/cart';
import { useAuth } from './AuthContext';

type CartContextValue = {
  cart: Cart | null;
  isLoading: boolean;
  itemsCount: number;
  fetchCart: () => Promise<void>;
  addItem: (productId: number, quantity: number) => Promise<void>;
  updateItem: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) { setCart(null); return; }
    setIsLoading(true);
    try {
      const data = await cartService.getCart();
      setCart(data);
    } catch {
      setCart(null);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch cart whenever auth state changes
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addItem = async (productId: number, quantity: number) => {
    const updated = await cartService.addToCart({ product_id: productId, quantity });
    setCart(updated);
  };

  const updateItem = async (itemId: number, quantity: number) => {
    const updated = await cartService.updateCartItem(itemId, { quantity });
    setCart(updated);
  };

  const removeItem = async (itemId: number) => {
    await cartService.removeCartItem(itemId);
    setCart((prev) => {
      if (!prev) return null;
      const items = prev.items.filter((i: CartItem) => i.id !== itemId);
      const total_price = items.reduce((sum: number, i: CartItem) => sum + i.subtotal, 0);
      return { ...prev, items, items_count: items.length, total_price };
    });
  };

  const clearCartFn = async () => {
    await cartService.clearCart();
    setCart(null);
  };

  const itemsCount = cart?.items_count ?? 0;

  return (
    <CartContext.Provider value={{ cart, isLoading, itemsCount, fetchCart, addItem, updateItem, removeItem, clearCart: clearCartFn }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
