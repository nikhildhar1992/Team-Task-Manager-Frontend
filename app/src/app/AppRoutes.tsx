import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from '../features/auth/LoginPage';
import { SignupPage } from '../features/auth/SignupPage';
import { ProtectedRoute } from '../features/auth/ProtectedRoute';
import { PublicOnlyRoute } from '../features/auth/PublicOnlyRoute';
import { AppLayout } from './AppLayout';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { TeamPage } from '../features/team/TeamPage';
import { TasksPage } from '../features/tasks/TasksPage';
import { SmartAssistantPage } from '../features/ai/SmartAssistantPage';
import { useAuth } from '../features/auth/useAuth';

function RouteFallback() {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />;
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
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/teams" element={<TeamPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/ai-assistant" element={<SmartAssistantPage />} />
        </Route>
      </Route>

      <Route path="*" element={<RouteFallback />} />
    </Routes>
  );
}
