import { api, unwrap } from './apiClient';
import type { CreateReviewPayload, Review, ReviewListParams } from '@/types/review';

export const reviewService = {
  getProductReviews: (productId: number, params?: ReviewListParams) =>
    unwrap<Review[]>(api.get(`/products/${productId}/reviews`, { params })),

  createReview: (payload: CreateReviewPayload) =>
    unwrap<Review>(api.post('/reviews', payload)),
};
