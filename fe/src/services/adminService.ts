import { api, call, unwrap } from './apiClient';
import type { ApiSuccess } from '@/types/api';
import type {
  AdminCustomer,
  AdminOrder,
  AdminProductDetail,
  AdminReview,
  AdminVoucher,
  ChartDataPoint,
  CreateVoucherPayload,
  DashboardOverview,
  PaginatedAdminResponse,
  TopProduct,
  UpdateVoucherPayload,
} from '@/types/admin';

function unwrapPaginated<T>(response: ApiSuccess<T[]>): PaginatedAdminResponse<T> {
  return {
    data: response.data,
    meta: { pagination: response.meta?.pagination },
  };
}

export const adminDashboardService = {
  getOverview: (days = 30) =>
    unwrap<DashboardOverview>(api.get('/admin/dashboard/overview', { params: { days } })),

  getCharts: (days = 30) =>
    unwrap<ChartDataPoint[]>(api.get('/admin/dashboard/charts', { params: { days } })),

  getTopProducts: (limit = 5) =>
    unwrap<TopProduct[]>(api.get('/admin/dashboard/top-products', { params: { limit } })),

  getCustomers: async (params?: { search?: string; per_page?: number; page?: number }) => {
    const res = await api.get<ApiSuccess<AdminCustomer[]>>('/admin/customers', { params });
    return unwrapPaginated(res.data);
  },

  toggleCustomerStatus: (id: number) =>
    unwrap<AdminCustomer>(api.put(`/admin/customers/${id}/toggle-status`)),
};

export const adminProductService = {
  create: (formData: FormData) =>
    unwrap<AdminProductDetail>(api.post('/admin/products', formData)),

  update: (id: number, formData: FormData) => {
    // Laravel requires _method=PUT to handle multipart/form-data updates via POST spoofing
    if (!formData.has('_method')) {
      formData.append('_method', 'PUT');
    }
    return unwrap<AdminProductDetail>(api.post(`/admin/products/${id}`, formData));
  },

  delete: (id: number) => call(api.delete(`/admin/products/${id}`)),
};

export const adminCategoryService = {
  create: (data: { name: string; description?: string }) =>
    unwrap(api.post('/admin/categories', data)),

  update: (id: number, data: { name?: string; description?: string }) =>
    unwrap(api.put(`/admin/categories/${id}`, data)),

  delete: (id: number) => call(api.delete(`/admin/categories/${id}`)),
};

export const adminOrderService = {
  getAll: async (params?: {
    status?: string;
    search?: string;
    date_from?: string;
    date_to?: string;
    per_page?: number;
    page?: number;
  }) => {
    const res = await api.get<ApiSuccess<AdminOrder[]>>('/admin/orders', { params });
    return unwrapPaginated(res.data);
  },

  getById: (id: number) =>
    unwrap<AdminOrder>(api.get(`/admin/orders/${id}`)),

  updateStatus: (id: number, status: string) =>
    unwrap<AdminOrder>(api.put(`/admin/orders/${id}/status`, { status })),
};

export const adminVoucherService = {
  getAll: async (params?: { status?: string; search?: string; per_page?: number; page?: number }) => {
    const res = await api.get<ApiSuccess<AdminVoucher[]>>('/admin/vouchers', { params });
    return unwrapPaginated(res.data);
  },

  create: (data: CreateVoucherPayload) =>
    unwrap<AdminVoucher>(api.post('/admin/vouchers', data)),

  update: (id: number, data: UpdateVoucherPayload) =>
    unwrap<AdminVoucher>(api.put(`/admin/vouchers/${id}`, data)),

  delete: (id: number) => call(api.delete(`/admin/vouchers/${id}`)),
};

export const adminReviewService = {
  getAll: async (params?: {
    rating?: number;
    product_id?: number;
    search?: string;
    per_page?: number;
    page?: number;
  }) => {
    const res = await api.get<ApiSuccess<AdminReview[]>>('/admin/reviews', { params });
    return unwrapPaginated(res.data);
  },

  delete: (id: number) => call(api.delete(`/admin/reviews/${id}`)),
};
