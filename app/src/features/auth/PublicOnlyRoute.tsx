import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './useAuth';

export function PublicOnlyRoute() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/tasks" replace />;
  }

  return <Outlet />;
}
