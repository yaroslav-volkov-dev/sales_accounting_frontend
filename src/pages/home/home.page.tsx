import { Button } from "@/components/ui/button"
import { routes } from "@/constants/routes"
import { NavLink } from "react-router-dom"

export const HomePage = () => {
  return (
    <div className="h-full grid grid-rows-4 justify-items-center items-center gap-4">
      <h1 className="text-5xl font-semibold">Sales Accounting</h1>
      <div className="flex gap-2">
        <NavLink to={routes.registration}>
          <Button className="w-40 h-12">
            Register
          </Button>
        </NavLink>
        <NavLink to={routes.login}>
          <Button variant="outline" className="w-40 h-12">
            Login
          </Button>
        </NavLink>
      </div>
    </div>
  )
}
