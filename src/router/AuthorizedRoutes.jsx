import { useAuth } from '../hooks/useAuth.js';
import { Navigate, Outlet } from 'react-router-dom';

export const AuthorizedRoutes = () => {
  const { isAuth } = useAuth();

  if (!isAuth) return <Navigate to="/login" />;

  return <Outlet />;
};