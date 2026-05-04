import { api, unwrap } from './apiClient';
import type { PaymentStatusResponse } from '@/types/order';

export const paymentService = {
    confirmReturn: (gateway: string, payload: Record<string, string>) =>
        unwrap<null>(api.post(`/payments/${gateway}/return`, payload)),

    getStatus: (orderId: number) =>
        unwrap<PaymentStatusResponse>(api.get(`/payments/${orderId}/status`)),
};
