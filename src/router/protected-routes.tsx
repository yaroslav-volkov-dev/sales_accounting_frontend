import { useUserQuery } from '@/api/queries/users'
import { Navigate, Outlet } from 'react-router-dom'

export const ProtectedRoutes = () => {
  const { isAuth } = useUserQuery()

  if (!isAuth) return <Navigate to="/login" />

  return <Outlet />
}
