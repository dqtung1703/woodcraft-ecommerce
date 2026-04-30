/**
 * Format a number to Vietnamese Dong currency string.
 * Example: 45000000 → "45.000.000 ₫"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a price difference as percentage discount.
 * Example: (52000000, 45000000) → "-13%"
 */
export function formatDiscount(original: number, final: number): string {
  const pct = Math.round(((original - final) / original) * 100);
  return `-${pct}%`;
}
