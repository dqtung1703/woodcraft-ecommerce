import { api, unwrap } from './apiClient';
import type { Category } from '@/types/category';

export const categoryService = {
  getCategories: () => unwrap<Category[]>(api.get('/categories')),

  getCategory: (id: number) => unwrap<Category>(api.get(`/categories/${id}`)),
};
