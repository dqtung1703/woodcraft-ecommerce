export const PATHS = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  HERITAGE: '/di-san',
  CONTACT: '/contact',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDER_SUCCESS: '/order-success',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  ORDERS: '/orders',
  ORDER_DETAIL: '/orders/:id',
  PAYMENT_RETURN: '/payment/return/:gateway',
  ADMIN_DASHBOARD: '/admin/dashboard',
} as const;

export const toProductDetail = (id: number | string) => `/products/${id}`;
export const toOrderDetail = (id: number | string) => `/orders/${id}`;
