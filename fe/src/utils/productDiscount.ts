import type { Product } from '@/types/product';
import { formatCurrency } from './formatCurrency';

export function getProductDiscountLabel(discount: Product['discount']): string | null {
  if (!discount) return null;

  if (typeof discount === 'number') {
    return `-${discount}%`;
  }

  if (discount.type === 'percent') {
    return `-${discount.value}%`;
  }

  return `-${formatCurrency(discount.value)}`;
}
