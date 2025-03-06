import { useAuth } from '@/hooks/useAuth.ts';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button.js';
import { cn } from "@/lib/utils.ts";
import { Container } from "@/components/container/container";

const authorizedLinks = [
  {
    label: 'Edit database',
    to: '/edit-database/products',
  }
];

const unauthorizedLinks = [
  {
    label: 'Registration',
    to: '/registration',
  },
  {
    label: 'Login',
    to: '/login',
  },
];


const renderLinks = (links: { label: string; to: string }[]) => links.map(({ to, label }) => (
  <NavLink
    to={to}
    key={to}
    className={({ isActive }) => isActive ? 'text-button-primary' : undefined}
  >
    {label}
  </NavLink>
));

export const Header = () => {
  const { logout, isAuth, userData } = useAuth();

  const { username } = userData || {};

  return (
    <header className="w-full h-16 bg-blue-200">
      <Container>
        <div className="h-full flex justify-between items-center">
          <div className="flex items-center">
            <NavLink
              to="/"
              className={({ isActive }) => cn(isActive && 'text-blue-500')}
            >
              <h2 className="font-[600] text-center text-[24px] flex flex-col">
                Sales accounting
              </h2>
            </NavLink>
          </div>
          {username && (
            <p className="text-center font-bold">
              Hello, {userData.username}
            </p>
          )}
          <div
            className="flex items-center gap-3">{isAuth ? (
            <>
              {renderLinks(authorizedLinks)}
              <Button onClick={logout}>
                Log out
              </Button>
            </>
          ) : renderLinks(unauthorizedLinks)}
          </div>
        </div>
      </Container>
    </header>
  );
};