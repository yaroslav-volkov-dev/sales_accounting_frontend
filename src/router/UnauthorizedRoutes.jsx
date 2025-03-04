import { useAuth } from '../hooks/useAuth.ts';
import { Navigate, Outlet } from 'react-router-dom';

export const UnauthorizedRoutes = () => {
  const { isAuth } = useAuth();

  if (isAuth) return <Navigate to="/" />;

  return <Outlet />;
};