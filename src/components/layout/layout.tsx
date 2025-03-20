import { NavLink, Outlet } from 'react-router-dom'
import { Aside } from '@/components/aside/aside.tsx'
import { Header } from '@/components/header/header.tsx'
import { cn } from '@/lib/utils.ts'

export const Layout = () => {
  return (
    <div className="h-screen grid grid-cols-[300px_1fr] grid-rows-[64px_minmax(0,1fr)]">
      <div className="h-16 flex justify-center items-center border-b border-r">
        <NavLink
          to="/"
          className={({ isActive }) => cn(isActive && 'text-accent-foreground')}
        >
          <h2 className="font-[600] text-center text-[24px] flex flex-col">
            Sales accounting
          </h2>
        </NavLink>
      </div>
      <Header />
      <Aside />
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  )
}
