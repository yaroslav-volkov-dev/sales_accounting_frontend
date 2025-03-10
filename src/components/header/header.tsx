import { useAuth } from '@/hooks/use-auth.ts';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button.js';
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
  const { logout, isAuth } = useAuth();

  return (
    <header className="w-full h-16 border-b border-gray-300">
      <Container>
        <div className="h-full flex justify-between items-center">
          {isAuth ? (
            <>
              {renderLinks(authorizedLinks)}
              <Button onClick={() => logout()}>
                Log out
              </Button>
            </>
          ) : renderLinks(unauthorizedLinks)}

        </div>
      </Container>
    </header>
  );
};