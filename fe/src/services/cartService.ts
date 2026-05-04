import { api, call, unwrap } from './apiClient';
import type { AddToCartPayload, Cart, UpdateCartItemPayload } from '@/types/cart';

export const cartService = {
  getCart: () => unwrap<Cart>(api.get('/cart')),

  addToCart: (payload: AddToCartPayload) =>
    unwrap<Cart>(api.post('/cart', payload)),

  updateCartItem: (itemId: number, payload: UpdateCartItemPayload) =>
    unwrap<Cart>(api.put(`/cart/${itemId}`, payload)),

  removeCartItem: (itemId: number) =>
    call(api.delete(`/cart/${itemId}`)),

  clearCart: () => call(api.delete('/cart')),
};
