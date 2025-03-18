import { useUserQuery } from '@/api/queries/users'
import { Navigate, Outlet } from 'react-router-dom'

export const UnauthorizedRoutes = () => {
  const { isAuth } = useUserQuery()

  if (isAuth) return <Navigate to="/" />

  return <Outlet />
}
