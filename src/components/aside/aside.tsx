import { useLogoutMutation, useUserQuery } from '@/api/queries/auth'
import { useCloseSessionMutation } from '@/api/queries/users'
import { Button } from '@/components/ui/button.tsx'
import { Separator } from '@/components/ui/separator.tsx'
import { routes } from '@/constants/routes'
import { cn } from '@/lib/utils.ts'
import { Building2, ListIcon, LucideEdit3, UserIcon, Users } from 'lucide-react'
import { ReactElement } from 'react'
import { NavLink } from 'react-router-dom'

type Link = {
  label: string
  to: string
  icon?: ReactElement
}

const authLinks: Link[] = [
  {
    label: 'Your Workspaces',
    to: routes.selectWorkspace,
    icon: <Building2 size={20} />,
  },
  {
    label: 'Profile',
    to: routes.profile,
    icon: <UserIcon size={20} />,
  },
]

const workspaceLinks: Link[] = [
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
    label: 'Company',
    to: routes.company,
    icon: <Users size={20} />,
  },
  ...authLinks,
]

const generateLinks = ({ isAuth, isSessionActive }: { isAuth: boolean, isSessionActive: boolean }) => {
  if (!isAuth) return []
  if (!isSessionActive) return authLinks

  return workspaceLinks
}

export const Aside = () => {
  const { isAuth, isSessionActive } = useUserQuery()
  const { mutate: logout, isPending: isLogoutPending } = useLogoutMutation()
  const { mutate: closeSession, isPending: isCloseSessionPending } = useCloseSessionMutation()

  return (
    <aside className="h-full flex flex-col">
      <Separator />
      <div className="flex flex-col grow p-4">
        <nav className="flex flex-col grow gap-2">
          {generateLinks({ isAuth, isSessionActive }).map(({ to, label, icon }) => (
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
          ))}
        </nav>
        <div className="flex flex-col gap-2">
          {isSessionActive && (
            <Button
              onClick={() => closeSession()}
              isLoading={isCloseSessionPending}
            >
              Close current session
            </Button>
          )}
          <Button
            className="w-full"
            onClick={() => logout()}
            isLoading={isLogoutPending}
          >
            Log out
          </Button>
        </div>
      </div>
    </aside>
  )
}
