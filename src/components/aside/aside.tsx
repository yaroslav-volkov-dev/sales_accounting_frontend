import { useLogoutMutation, useUserQuery } from '@/api/queries/auth'
import { ShiftController, ShiftControllerSkeleton } from '@/components/shift-controller/shift-controller.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Separator } from '@/components/ui/separator.tsx'
import { routes } from '@/constants/routes'
import { cn } from '@/lib/utils.ts'
import { Building2, ListIcon, LucideEdit3, UserIcon } from 'lucide-react'
import { ReactElement } from 'react'
import { NavLink } from 'react-router-dom'
import { Skeleton } from '../ui/skeleton'

type Link = {
  label: string
  to: string
  icon?: ReactElement
}

const authorizedLinks: Link[] = [
  {
    label: 'Shift View',
    to: routes.shiftView,
    icon: <ListIcon size={20} />,
  },
  {
    label: 'Edit database',
    to: routes.editDatabase.base,
    icon: <LucideEdit3 size={20} />,
  },
  {
    label: 'Profile',
    to: routes.profile,
    icon: <UserIcon size={20} />,
  },
  {
    label: 'Company',
    to: routes.company,
    icon: <Building2 size={20} />,
  },
]

const unauthorizedLinks: Link[] = [
  {
    label: 'Registration',
    to: routes.registration,
  },
  {
    label: 'Login',
    to: routes.login,
  },
]

const renderLinks = (links: Link[]) => links.map(({ to, label, icon }) => (
  <NavLink
    to={to}
    key={to}
    className={({ isActive }) =>
      cn(
        'flex items-center gap-3 p-2 text-lg font-semibold hover:bg-accent rounded-lg',
        isActive && 'font-bold bg-accent [&>svg]:stroke-3'
      )
    }
  >
    {icon}
    {label}
  </NavLink>
))

const renderNavigation = ({ isAuth, isAuthPending }: { isAuth: boolean, isAuthPending: boolean }) => {
  if (isAuthPending) return (

    <>
      <Skeleton className="w-full h-11" />
      <Skeleton className="w-full h-11" />
      <Skeleton className="w-full h-11" />
      <Skeleton className="w-full h-11" />
      <Skeleton className="w-full h-11" />
      <Skeleton className="w-full h-11" />
      <Skeleton className="w-full h-11" />
    </>
  )

  return (
    <>
      {isAuth ? renderLinks(authorizedLinks) : renderLinks(unauthorizedLinks)}
    </>
  )
}

const renderLogoutButton = ({
  isAuth,
  isAuthPending,
  logout,
  isLogoutPending }:
  {
    isAuth: boolean,
    isAuthPending: boolean,
    logout: () => void,
    isLogoutPending: boolean
  }) => {

  if (isAuthPending) return (
    <Skeleton className="w-full h-9" />
  )

  if (!isAuth) return null

  return (
    <Button
      className="w-full"
      onClick={() => logout()}
      isLoading={isLogoutPending}
    >
      Log out
    </Button>
  )
}

const renderShiftController = ({ isAuth, isAuthPending }: { isAuth: boolean, isAuthPending: boolean }) => {

  if (isAuthPending) {
    return (
      <div className="px-4 py-4">
        <ShiftControllerSkeleton />
      </div>
    )
  }
  if (isAuth) {
    return (
      <div className="px-4 py-4">
        <ShiftController />
      </div>
    )
  }

  return null
}


export const Aside = () => {
  const { isAuth, isPending: isAuthPending } = useUserQuery()
  const { mutate: logout, isPending: isLogoutPending } = useLogoutMutation()

  return (
    <aside className="h-full flex flex-col border-r">
      {renderShiftController({ isAuth, isAuthPending })}
      <Separator />
      <div className="flex flex-col grow p-4">
        <nav className="flex flex-col grow gap-2">
          {renderNavigation({ isAuth, isAuthPending })}
        </nav>
        {renderLogoutButton({ isAuth, isAuthPending, logout, isLogoutPending })}
      </div>
    </aside>
  )
}
