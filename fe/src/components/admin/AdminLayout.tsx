import { LogOut, Menu } from 'lucide-react';
import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '@/contexts/AuthContext';
import NotificationBell from '@/components/ui/NotificationBell';

const PAGE_TITLES: Record<string, string> = {
  '/admin/dashboard': 'Tổng quan',
  '/admin/products': 'Sản phẩm',
  '/admin/products/new': 'Thêm sản phẩm',
  '/admin/categories': 'Danh mục',
  '/admin/orders': 'Đơn hàng',
  '/admin/vouchers': 'Mã giảm giá',
  '/admin/customers': 'Khách hàng',
  '/admin/reviews': 'Đánh giá',
};

function getPageTitle(pathname: string) {
  if (pathname.match(/^\/admin\/products\/\d+\/edit$/)) {
    return 'Sửa sản phẩm';
  }

  return PAGE_TITLES[pathname] ?? 'Admin';
}

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const title = getPageTitle(location.pathname);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900">
      <div className="hidden md:block">
        <AdminSidebar />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-slate-950/50" onClick={() => setMobileOpen(false)} />
          <div className="relative h-full w-64 shadow-xl">
            <AdminSidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 md:hidden"
              aria-label="Mở menu admin"
            >
              <Menu className="h-4 w-4" />
            </button>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Quản trị
              </p>
              <h1 className="text-lg font-semibold text-slate-950">{title}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-900">{user?.name ?? 'Admin'}</p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
              {(user?.name?.[0] ?? 'A').toUpperCase()}
            </div>
            <NotificationBell variant="admin" />
            <button
              type="button"
              onClick={logout}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
              aria-label="Đăng xuất"
              title="Đăng xuất"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
