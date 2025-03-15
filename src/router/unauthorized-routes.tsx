import { useAuth } from '@/hooks/use-auth.ts';
import { Navigate, Outlet } from 'react-router-dom';

export const UnauthorizedRoutes = () => {
  const { isAuth } = useAuth()

  console.log('isAuth', isAuth);

  if (isAuth) return <Navigate to="/" />

  return <Outlet />
}
