import { useUserQuery } from '@/api/queries/auth'
import { Aside } from '@/components/aside/aside.tsx'
import { cn } from '@/lib/utils'
import { Outlet } from 'react-router-dom'
import { Card } from '../ui/card'

export const Layout = () => {
  const { isAuth } = useUserQuery()

  return (
    <div className={cn('h-screen grid bg-accent', isAuth && 'grid-cols-[250px_1fr]')}>
      {isAuth && <Aside />}
      <main className="h-full p-4">
        <Card className="h-full p-4">
          <Outlet />
        </Card>
      </main>
    </div>
  )
}
