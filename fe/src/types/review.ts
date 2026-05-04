export type Review = {
  id: number;
  product_id: number;
  user_id: number;
  user_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
};

export type CreateReviewPayload = {
  product_id: number;
  rating: number;
  comment?: string;
};

export type ReviewListParams = {
  rating?: number;
  per_page?: number;
};
