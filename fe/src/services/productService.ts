import { api, unwrap } from './apiClient';
import type { ApiSuccess } from '@/types/api';
import type { Product, ProductDetail, ProductListParams } from '@/types/product';

// Kiểu dữ liệu phân trang trả về từ Backend
export type PaginatedProducts = {
  data: Product[];
  meta: {
    pagination: {
      total: number;
      per_page: number;
      current_page: number;
      last_page: number;
    };
  };
};

export const productService = {
  // Trả về cả data + meta phân trang
  getProducts: async (params?: ProductListParams): Promise<PaginatedProducts> => {
    const res = await api.get<ApiSuccess<Product[]>>('/products', { params });
    return {
      data: res.data.data,
      meta: res.data.meta as PaginatedProducts['meta'],
    };
  },

  getProduct: (id: number) =>
    unwrap<ProductDetail>(api.get(`/products/${id}`)),

  getRelatedProducts: (id: number) =>
    unwrap<Product[]>(api.get(`/products/${id}/related`)),

  // Lấy sản phẩm nổi bật (sort theo sold_count) dùng cho gợi ý khi không có kết quả
  getFeaturedProducts: (limit = 4) =>
    unwrap<Product[]>(
      api.get('/products', {
        params: { sort_by: 'sold_count', sort_dir: 'desc', per_page: limit },
      }),
    ).then((res: any) => (Array.isArray(res) ? res : res.data ?? [])),
};
