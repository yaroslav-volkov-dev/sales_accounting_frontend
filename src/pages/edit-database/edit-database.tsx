import { NavLink, Outlet } from 'react-router-dom';
import { cn } from '@/lib/utils.js';

const links = [
  {
    label: 'Products',
    to: 'products'
  },
  {
    label: 'Categories',
    to: 'categories'
  },
  {
    label: 'Suppliers',
    to: 'suppliers'
  },
  {
    label: 'Stores',
    to: 'stores'
  },
];


export const EditDatabase = () => (
  <div>
    <nav className="flex gap-3 pb-4 border-b border-gray-200">
      {links.map(({ to, label }) => (
        <NavLink
          to={to}
          className={({ isActive }) => cn('text-xl font-bold', isActive && 'text-blue-500')}
          key={to}
        >
          {label}
        </NavLink>
      ))}
    </nav>
    <div className="mt-6">
      <Outlet />
    </div>
  </div>
);