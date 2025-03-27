import { useUserQuery } from "@/api/queries/auth"
import { Loader } from "@/components/loader/loader"
import { routes } from "@/constants/routes"
import { Navigate } from "react-router-dom"

const ProtectedRouteLoader = () => <div className="flex justify-center items-center h-full"><Loader size={100} /></div>

const WorkspaceRoute = ({ element }: { element: React.ReactNode }) => {
  const { isAuth, isPending, data } = useUserQuery()

  if (isPending) return <ProtectedRouteLoader />
  if (!isAuth) return <Navigate to={routes.login} />
  if (!data?.user?.activeOrganizationId) return <Navigate to={routes.selectWorkspace} />

  return element
}

const IntermediateRoute = ({ element }: { element: React.ReactNode }) => {
  const { isAuth, isPending, data } = useUserQuery()

  if (isPending) return <ProtectedRouteLoader />
  if (!isAuth) return <Navigate to={routes.login} />
  if (data?.user?.activeOrganizationId) return <Navigate to={routes.shiftView} />

  return element
}

const UnauthorizedRoute = ({ element }: { element: React.ReactNode }) => {
  const { isAuth, isPending, data } = useUserQuery()

  if (isPending) return <ProtectedRouteLoader />

  if (!isAuth) return element

  const hasActiveOrganization = !!data?.user?.activeOrganizationId

  if (hasActiveOrganization) return <Navigate to={routes.shiftView} />

  return <Navigate to={routes.selectWorkspace} />
}

export const ProtectedRoute = {
  Unauthorized: UnauthorizedRoute,
  Workspace: WorkspaceRoute,
  Intermediate: IntermediateRoute,
}






