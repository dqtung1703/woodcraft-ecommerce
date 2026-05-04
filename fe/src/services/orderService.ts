import { api, call, unwrap } from './apiClient';
import type { CreateOrderPayload, CreateOrderResponse, Order } from '@/types/order';

export const orderService = {
  getOrders: () => unwrap<Order[]>(api.get('/orders')),

  getOrder: (id: number) => unwrap<Order>(api.get(`/orders/${id}`)),

  createOrder: (payload: CreateOrderPayload) =>
    unwrap<CreateOrderResponse>(api.post('/orders', payload)),

  cancelOrder: (id: number) => call(api.put(`/orders/${id}/cancel`)),

  retryPayment: (orderId: number) =>
    unwrap<{ payment_url: string }>(api.post(`/payments/${orderId}/retry`)),
};
