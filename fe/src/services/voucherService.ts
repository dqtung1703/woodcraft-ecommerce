import { api, unwrap } from './apiClient';
import type { ApplyVoucherPayload, Voucher } from '@/types/voucher';

export const voucherService = {
  applyVoucher: (payload: ApplyVoucherPayload) =>
    unwrap<Voucher>(api.post('/vouchers/apply', payload)),
};
