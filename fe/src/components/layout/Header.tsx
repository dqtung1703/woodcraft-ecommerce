import { LayoutDashboard, LogIn, ShoppingBag, User } from 'lucide-react';
import { useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { authService } from '@/services/authService';
import NotificationBell from '@/components/ui/NotificationBell';
import { PATHS } from '@/utils/routePaths';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { itemsCount } = useCart();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const linkBase = 'font-sans uppercase text-xs tracking-widest transition-colors duration-300';
  const activeClass = `${linkBase} text-primary font-bold border-b-2 border-primary pb-1`;
  const inactiveClass = `${linkBase} text-on-surface-variant hover:text-primary`;
  const navLinkClass = ({ isActive }: { isActive: boolean }) => (isActive ? activeClass : inactiveClass);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore logout API errors and clear the local session.
    }
    logout();
    setDropdownOpen(false);
    navigate(PATHS.HOME);
  };

  return (
    <nav className="fixed top-0 w-full flex justify-between items-center px-6 md:px-12 py-6 bg-[#E7E6E1]/90 backdrop-blur-xl z-50">
      <Link to={PATHS.HOME} className="text-2xl md:text-3xl font-serif italic text-on-surface">
        Chuyên Mỹ Artisan
      </Link>

      <div className="hidden md:flex items-center gap-12">
        <NavLink className={navLinkClass} to={PATHS.HOME} end>
          TRANG CHỦ
        </NavLink>
        <NavLink className={navLinkClass} to={PATHS.PRODUCTS}>
          BỘ SƯU TẬP
        </NavLink>
        <NavLink className={navLinkClass} to={PATHS.HERITAGE}>
          DI SẢN
        </NavLink>
        <NavLink className={navLinkClass} to={PATHS.CONTACT}>
          LIÊN HỆ
        </NavLink>
      </div>

      <div className="flex items-center gap-5 md:gap-7 text-primary">
        {isAuthenticated && (
          <>
            <NotificationBell />
            <Link to={PATHS.CART} className="relative hover:scale-105 transition-transform" aria-label="Giỏ hàng">
              <ShoppingBag className="w-6 h-6" />
              {itemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full leading-none px-1">
                  {itemsCount > 99 ? '99+' : itemsCount}
                </span>
              )}
            </Link>
          </>
        )}

        {isAuthenticated ? (
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen((open) => !open)}
              className="flex items-center gap-2 hover:text-primary/80 transition-colors"
              aria-label="Tài khoản"
              aria-expanded={dropdownOpen}
            >
              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                {user?.name?.[0]?.toUpperCase() ?? 'U'}
              </div>
              <span className="hidden md:block text-xs font-medium text-on-surface max-w-[100px] truncate">
                {user?.name}
              </span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-44 bg-white rounded-2xl shadow-xl border border-outline-variant/20 py-2 z-50 font-sans">
                <Link
                  to={PATHS.PROFILE}
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-surface-container-low transition-colors font-sans"
                >
                  <User className="w-4 h-4" /> Tài khoản
                </Link>
                <Link
                  to={PATHS.ORDERS}
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-surface-container-low transition-colors font-sans"
                >
                  <ShoppingBag className="w-4 h-4" /> Đơn hàng
                </Link>
                {user?.is_admin && (
                  <Link
                    to={PATHS.ADMIN_DASHBOARD}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-surface-container-low transition-colors font-sans"
                  >
                    <LayoutDashboard className="w-4 h-4" /> Quản trị
                  </Link>
                )}
                <hr className="my-1 border-outline-variant/30" />
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors font-sans"
                >
                  <LogIn className="w-4 h-4 rotate-180" /> Đăng xuất
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to={PATHS.LOGIN}
            className="flex items-center gap-2 hover:scale-105 transition-transform"
            aria-label="Đăng nhập"
          >
            <LogIn className="w-5 h-5" />
            <span className="hidden md:block text-xs font-medium">Đăng nhập</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
