import { useLogoutMutation, useUserQuery } from '@/api/queries/users'
import { ShiftController } from '@/components/shift-controller/shift-controller.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Separator } from '@/components/ui/separator.tsx'
import { routes } from '@/constants/routes'
import { cn } from '@/lib/utils.ts'
import { Building2, ListIcon, LucideEdit3, UserIcon } from 'lucide-react'
import { ReactElement } from 'react'
import { NavLink } from 'react-router-dom'

type Link = {
  label: string
  to: string
  icon?: ReactElement
}

const authorizedLinks = [
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

const unauthorizedLinks = [
  {
    label: 'Registration',
    to: routes.registration,
  },
  {
    label: 'Login',
    to: routes.login,
  },
]

const renderLinks = (links: Link[]) =>
  links.map(({ to, label, icon }) => (
    <NavLink
      to={to}
      key={to}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 p-2 text-xl font-semibold hover:bg-accent rounded-lg',
          isActive && 'font-bold bg-accent [&>svg]:stroke-3'
        )
      }
    >
      {icon}
      {label}
    </NavLink>
  ))

export const Aside = () => {
  const { isAuth } = useUserQuery()
  const { mutate: logout, isPending: isLogoutPending } = useLogoutMutation()

  return (
    <aside className="h-full flex flex-col pb-4 border-r">
      {isAuth && (
        <>
          <div className="px-4">
            <ShiftController />
          </div>
          <Separator />
        </>
      )}
      <nav className="flex flex-col grow gap-2 p-4">
        {isAuth ? renderLinks(authorizedLinks) : renderLinks(unauthorizedLinks)}
      </nav>
      <div className="px-4">
        {isAuth && (
          <Button
            onClick={() => logout()}
            className="w-full"
            isLoading={isLogoutPending}
          >
            Log out
          </Button>
        )}
      </div>
    </aside>
  )
}
