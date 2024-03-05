import { NavLink } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

export const Link = ({ to, children, className, ...rest }) => (
  <NavLink
    {...rest}
    to={to}
    key={to}
    className={({ isActive }) => twMerge(isActive && 'text-button-primary', className)}
  >
    {children}
  </NavLink>
);