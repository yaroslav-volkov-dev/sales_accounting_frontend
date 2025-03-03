import { NavLink, Outlet } from 'react-router-dom';

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
];


export const EditDatabase = () => {

  return (
    <div>
      <div className="flex gap-3">
        {links.map(({ to, label }) => (
          <NavLink
            to={to}
            className={({ isActive }) => isActive ? 'text-button-primary' : undefined}
            key={to}
          >
            {label}
          </NavLink>
        ))}
      </div>
      <Outlet />
    </div>
  );
};