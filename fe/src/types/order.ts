export type OrderStatus = 'pending' | 'processing' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';
export type PaymentMethod = 'cod' | 'banking' | 'vnpay' | 'momo';
export type PaymentStatus = 'unpaid' | 'pending' | 'paid' | 'failed' | 'cancelled' | 'expired' | 'refunded';

export type Payment = {
  id: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  amount: number;
  paid_at: string | null;
  expired_at: string | null;
};

export type OrderItem = {
  id: number;
  product_id: number;
  product_name: string;
  image: string | null;
  price: number;
  quantity: number;
  subtotal: number;
};

export type Order = {
  id: number;
  status: OrderStatus;
  status_label: string;
  total_price: number;
  discount_amount: number;
  final_price: number;
  items_count: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  voucher_code: string | null;
  note: string | null;
  shipping_name?: string;
  shipping_phone?: string;
  shipping_address?: string;
  items: OrderItem[];
  created_at: string;
};

export type CreateOrderPayload = {
  payment_method: PaymentMethod;
  voucher_code?: string;
  note?: string;
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
};

export type CreateOrderResponse = {
  order: Order;
  payment_url: string | null;
};

export type PaymentStatusResponse = {
  order_id: number;
  order_status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  paid_at: string | null;
};
