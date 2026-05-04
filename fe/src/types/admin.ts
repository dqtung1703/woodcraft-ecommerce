import type { Order } from './order';

export type DashboardOverview = {
  revenue: { value: number; growth: number };
  orders: { value: number; growth: number };
  customers: { value: number; growth: number };
  total_products: number;
};

export type ChartDataPoint = {
  date: string;
  revenue: number;
  orders: number;
};

export type TopProduct = {
  id: number;
  name: string;
  price: number;
  total_sold: number;
  total_revenue: number;
};

export type AdminVoucher = {
  id: number;
  code: string;
  discount_type: 'percent' | 'fixed';
  discount_value: number;
  min_order_value: number;
  max_discount: number | null;
  quantity: number;
  used_count: number;
  per_user_limit: number | null;
  start_date: string | null;
  end_date: string | null;
  status: 'active' | 'inactive';
};

export type CreateVoucherPayload = {
  code: string;
  discount_type: 'percent' | 'fixed';
  discount_value: number;
  min_order_value: number;
  max_discount?: number | null;
  quantity: number;
  per_user_limit?: number | null;
  start_date?: string | null;
  end_date?: string | null;
};

export type UpdateVoucherPayload = Partial<CreateVoucherPayload> & {
  status?: 'active' | 'inactive';
};

export type AdminCustomer = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  total_spent: number | null;
  orders_count: number;
  is_active: boolean;
  created_at: string;
};

export type AdminOrder = Order & {
  user: { id: number; name: string; email: string } | null;
};

export type AdminReview = {
  id: number;
  rating: number;
  comment: string | null;
  created_at: string;
  user: { id: number; name: string };
  product: { id: number; name: string };
};

export type AdminProductDetail = {
  id: number;
  name: string;
  description: string | null;
  original_price: number;
  cost_price: number;
  price: number;
  final_price: number;
  stock: number;
  material: string | null;
  category: { id: number; name: string } | null;
  images: string[];
  avg_rating: number;
  has_discount: boolean;
  discount: { type: string; value: number } | null;
  created_at: string;
};

export type ProductFormState = {
  name: string;
  original_price: string;
  cost_price: string;
  price: string;
  stock: string;
  category_id: string;
  description: string;
  material: string;
  newImageFiles: File[];
  keepImageUrls: string[];
};

export type PaginationMeta = {
  total: number;
  per_page?: number;
  current_page: number;
  last_page: number;
};

export type PaginatedAdminResponse<T> = {
  data: T[];
  meta: {
    pagination?: PaginationMeta;
  };
};
