import { useUserQuery } from "@/api/queries/users"
import { routes } from "@/constants/routes"
import { Navigate } from "react-router-dom"

const AuthorizedRoute = ({ element }: { element: React.ReactNode }) => {
  const { isAuth, isPending } = useUserQuery()
  if (isPending) return <div>Loading...</div>
  if (!isAuth) return <Navigate to={routes.login} />
  return element
}

const UnauthorizedRoute = ({ element }: { element: React.ReactNode }) => {
  const { isAuth, isPending } = useUserQuery()
  if (isPending) return <div>Loading...</div>
  if (isAuth) return <Navigate to={routes.shiftView} />
  return element
}

export const ProtectedRoute = {
  Authorized: AuthorizedRoute,
  Unauthorized: UnauthorizedRoute,
}






