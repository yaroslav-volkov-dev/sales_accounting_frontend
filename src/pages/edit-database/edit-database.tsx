import { NavLink, Outlet } from 'react-router-dom'
import { cn } from '@/lib/utils.js'
import { Card } from '@/components/ui/card.tsx'

const links = [
  {
    label: 'Products',
    to: 'products',
  },
  {
    label: 'Categories',
    to: 'categories',
  },
  {
    label: 'Suppliers',
    to: 'suppliers',
  },
  {
    label: 'Stores',
    to: 'stores',
  },
]

export const EditDatabase = () => (
  <div className="h-full flex flex-col">
    <nav className="flex gap-3 pb-4 border-b border-gray-200">
      {links.map(({ to, label }) => (
        <NavLink
          to={to}
          className={({ isActive }) =>
            cn(
              'px-3 py-1 rounded-lg text-xl font-semibold hover:bg-accent',
              isActive && 'bg-accent'
            )
          }
          key={to}
        >
          {label}
        </NavLink>
      ))}
    </nav>
    <Card className="mt-6 p-3 grow">
      <Outlet />
    </Card>
  </div>
)
