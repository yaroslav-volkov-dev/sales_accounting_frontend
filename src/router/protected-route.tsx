import { useUserQuery } from "@/api/queries/auth"
import { routes } from "@/constants/routes"
import { Navigate } from "react-router-dom"

const WorkspaceRoute = ({ element }: { element: React.ReactNode }) => {
  const { isAuth, isPending, data } = useUserQuery()

  if (isPending) return <div>Loading...</div>
  if (!isAuth) return <Navigate to={routes.login} />
  if (!data?.user?.activeOrganizationId) return <Navigate to={routes.selectWorkspace} />

  return element
}

const IntermediateRoute = ({ element }: { element: React.ReactNode }) => {
  const { isAuth, isPending, data } = useUserQuery()

  if (isPending) return <div>Loading...</div>
  if (!isAuth) return <Navigate to={routes.login} />
  if (data?.user?.activeOrganizationId) return <Navigate to={routes.shiftView} />

  return element
}

const AuthorizedRoute = ({ element }: { element: React.ReactNode }) => {
  const { isAuth, isPending } = useUserQuery()
  if (isPending) return <div>Loading...</div>
  if (!isAuth) return <Navigate to={routes.login} />
  return element
}

const UnauthorizedRoute = ({ element }: { element: React.ReactNode }) => {
  const { isAuth, isPending, data } = useUserQuery()

  if (isPending) return <div>Loading...</div>

  if (!isAuth) return element

  const hasActiveOrganization = !!data?.user?.activeOrganizationId

  if (hasActiveOrganization) return <Navigate to={routes.shiftView} />

  return <Navigate to={routes.selectWorkspace} />
}

export const ProtectedRoute = {
  Authorized: AuthorizedRoute,
  Unauthorized: UnauthorizedRoute,
  Workspace: WorkspaceRoute,
  Intermediate: IntermediateRoute,
}






