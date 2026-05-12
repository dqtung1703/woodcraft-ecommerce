import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { PATHS } from '@/utils/routePaths';

export default function AdminRoute() {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to={`${PATHS.LOGIN}?redirect=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  if (!user?.is_admin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
