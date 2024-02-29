import { useAuth } from '../hooks/useAuth.js';
import { Navigate, Outlet } from 'react-router-dom';

export const UnauthorizedRoutes = () => {
  const { isAuth } = useAuth();

  if (isAuth) return <Navigate to="/" />;

  return <Outlet />;
};