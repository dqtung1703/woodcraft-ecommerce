export type Voucher = {
  code: string;
  discount_type: 'percent' | 'fixed';
  discount_value: number;
  discount_amount: number;
  final_total: number;
};

export type ApplyVoucherPayload = {
  code: string;
  order_total: number;
};
