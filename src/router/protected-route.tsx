import { useUserQuery } from "@/api/queries/auth"
import { Loader } from "@/components/loader/loader"
import { routes } from "@/constants/routes"
import { Navigate } from "react-router-dom"

const ProtectedRouteLoader = () => <div className="flex justify-center items-center h-full"><Loader size={100} /></div>

const WorkspaceRoute = ({ element }: { element: React.ReactNode }) => {
  const { isAuth, isPending, data, isSessionActive } = useUserQuery()

  if (isPending) return <ProtectedRouteLoader />
  if (!isAuth) return <Navigate to={routes.login} />
  if (!isSessionActive) return <Navigate to={routes.selectWorkspace} />

  return element
}

const IntermediateRoute = ({ element }: { element: React.ReactNode }) => {
  const { isAuth, isPending, isSessionActive } = useUserQuery()

  if (isPending) return <ProtectedRouteLoader />
  if (!isAuth) return <Navigate to={routes.login} />
  if (isSessionActive) return <Navigate to={routes.shiftView} />

  return element
}

const UnauthorizedRoute = ({ element }: { element: React.ReactNode }) => {
  const { isAuth, isPending, isSessionActive } = useUserQuery()

  if (isPending) return <ProtectedRouteLoader />
  if (!isAuth) return element
  if (isSessionActive) return <Navigate to={routes.shiftView} />

  return <Navigate to={routes.selectWorkspace} />
}

export const ProtectedRoute = {
  Unauthorized: UnauthorizedRoute,
  Workspace: WorkspaceRoute,
  Intermediate: IntermediateRoute,
}






