import { createBrowserRouter, Navigate } from 'react-router-dom';
import AdminRoute from '@/components/auth/AdminRoute';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import MainLayout from '@/components/layout/MainLayout';
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';
import ContactPage from '@/pages/ContactPage';
import HeritageDetailPage from '@/pages/HeritageDetailPage';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import NotFoundPage from '@/pages/NotFoundPage';
import OrderDetailPage from '@/pages/OrderDetailPage';
import OrderSuccessPage from '@/pages/OrderSuccessPage';
import OrdersPage from '@/pages/OrdersPage';
import PaymentResultPage from '@/pages/PaymentResultPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import ProductsPage from '@/pages/ProductsPage';
import ProfilePage from '@/pages/ProfilePage';
import RegisterPage from '@/pages/RegisterPage';
import AdminCategoriesPage from '@/pages/admin/AdminCategoriesPage';
import AdminCustomersPage from '@/pages/admin/AdminCustomersPage';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import AdminOrdersPage from '@/pages/admin/AdminOrdersPage';
import AdminProductFormPage from '@/pages/admin/AdminProductFormPage';
import AdminProductsPage from '@/pages/admin/AdminProductsPage';
import AdminReviewsPage from '@/pages/admin/AdminReviewsPage';
import AdminVouchersPage from '@/pages/admin/AdminVouchersPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      // ── Public routes ────────────────────────────────
      { index: true, element: <HomePage /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'products/:id', element: <ProductDetailPage /> },
      { path: 'di-san', element: <HeritageDetailPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },

      // ── Protected routes (require auth) ───────────────
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'cart', element: <CartPage /> },
          { path: 'checkout', element: <CheckoutPage /> },
          { path: 'order-success', element: <OrderSuccessPage /> },
          { path: 'payment/return/:gateway', element: <PaymentResultPage /> },
          { path: 'profile', element: <ProfilePage /> },
          { path: 'orders', element: <OrdersPage /> },
          { path: 'orders/:id', element: <OrderDetailPage /> },
        ],
      },

      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: 'dashboard', element: <AdminDashboardPage /> },
          { path: 'products', element: <AdminProductsPage /> },
          { path: 'products/new', element: <AdminProductFormPage /> },
          { path: 'products/:id/edit', element: <AdminProductFormPage /> },
          { path: 'categories', element: <AdminCategoriesPage /> },
          { path: 'orders', element: <AdminOrdersPage /> },
          { path: 'vouchers', element: <AdminVouchersPage /> },
          { path: 'customers', element: <AdminCustomersPage /> },
          { path: 'reviews', element: <AdminReviewsPage /> },
        ],
      },
    ],
  },
]);
