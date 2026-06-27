import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from '../features/auth/LoginPage';
import { SignupPage } from '../features/auth/SignupPage';
import { ProtectedRoute } from '../features/auth/ProtectedRoute';
import { PublicOnlyRoute } from '../features/auth/PublicOnlyRoute';
import { AppLayout } from './AppLayout';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { PortfolioPage } from '../features/portfolio/PortfolioPage';
import { RbacPage } from '../features/rbac/RbacPage';
import { SmartAssistantPage } from '../features/ai/SmartAssistantPage';
import { useAuth } from '../features/auth/useAuth';

function RouteFallback() {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? '/portfolio' : '/login'} replace />;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/portfolio" replace />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/rbac" element={<RbacPage />} />
          <Route path="/teams" element={<Navigate to="/rbac" replace />} />
          <Route path="/tasks" element={<Navigate to="/rbac" replace />} />
          <Route path="/ai-assistant" element={<SmartAssistantPage />} />
        </Route>
      </Route>

      <Route path="*" element={<RouteFallback />} />
    </Routes>
  );
}
