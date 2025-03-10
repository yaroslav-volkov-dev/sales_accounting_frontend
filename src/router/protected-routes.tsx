import { useAuth } from '../hooks/use-auth.ts';
import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoutes = () => {
  const { isAuth } = useAuth();

  if (!isAuth) return <Navigate to="/login" />;

  return <Outlet />;
};