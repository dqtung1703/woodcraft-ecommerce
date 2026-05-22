import {
  ClipboardList,
  LayoutDashboard,
  Package,
  Star,
  Store,
  Tag,
  Ticket,
  Users,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/admin/dashboard', label: 'Tổng quan', icon: LayoutDashboard },
  { to: '/admin/products', label: 'Sản phẩm', icon: Package },
  { to: '/admin/categories', label: 'Danh mục', icon: Tag },
  { to: '/admin/orders', label: 'Đơn hàng', icon: ClipboardList },
  { to: '/admin/vouchers', label: 'Mã giảm giá', icon: Ticket },
  { to: '/admin/customers', label: 'Khách hàng', icon: Users },
  { to: '/admin/reviews', label: 'Đánh giá', icon: Star },
];

type AdminSidebarProps = {
  onNavigate?: () => void;
};

export default function AdminSidebar({ onNavigate }: AdminSidebarProps) {
  return (
    <aside className="flex h-full w-64 shrink-0 flex-col overflow-y-auto bg-slate-900 px-3 py-4 text-white">
      <div className="px-3 pb-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Woodcraft
        </p>
        <p className="mt-1 text-lg font-semibold">Admin</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition',
                isActive
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white',
              ].join(' ')
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-4 border-t border-slate-800 pt-4">
        <NavLink
          to="/"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
        >
          <Store className="h-4 w-4 shrink-0" />
          <span>Về cửa hàng</span>
        </NavLink>
      </div>
    </aside>
  );
}
