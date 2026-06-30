import type { Category } from './category';
import type { Review } from './review';

export type Product = {
  id: number;
  name: string;
  price: number;
  final_price: number;
  original_price: number | null;
  cost_price: number | null;
  stock: number;
  sold_count: number;
  material: string | null;
  category: Category | null;
  image: string | null;
  avg_rating: number;
  has_discount: boolean;
  discount: ProductDiscount | number | null;
};

export type ProductDiscount = {
  type: 'percent' | 'fixed';
  value: number;
  start_date?: string;
  end_date?: string;
};

export type ProductDetail = Product & {
  description: string | null;
  images: string[];
  reviews_count: number;
  reviews: Review[];
  created_at: string;
};

export type ProductListParams = {
  search?: string;
  category_id?: number;
  min_price?: number;
  max_price?: number;
  material?: string;
  sort_by?: 'price' | 'name' | 'created_at' | 'stock' | 'sold_count';
  sort_dir?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
};
