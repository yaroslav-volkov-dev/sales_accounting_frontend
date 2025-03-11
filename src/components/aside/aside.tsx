import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils.ts";
import { ShiftController } from "@/components/shift-controller/shift-controller.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { useAuth } from "@/hooks/use-auth.ts";
import { ListIcon, LucideEdit3 } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { ReactElement } from "react";

type Link = {
  label: string;
  to: string;
  icon?: ReactElement
}

const authorizedLinks = [
  {
    label: 'Shift View',
    to: '/shift-view',
    icon: <ListIcon size={20} />
  },
  {
    label: 'Edit database',
    to: '/edit-database',
    icon: <LucideEdit3 size={20} />
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

const renderLinks = (links: Link[]) => links.map(({ to, label, icon }) => (
  <NavLink
    to={to}
    key={to}
    className={({ isActive }) =>
      cn('flex items-center gap-3 p-2 text-xl font-semibold hover:bg-accent rounded-lg', isActive && 'font-bold [&>svg]:stroke-3')}
  >
    {icon}
    {label}
  </NavLink>
));

export const Aside = () => {
  const { isAuth, logout } = useAuth();

  return (
    <aside className="h-full flex flex-col pb-4 border-r">
      <div className="h-16 flex justify-center items-center border-b">
        <NavLink
          to="/"
          className={({ isActive }) => cn(isActive && 'text-blue-500')}
        >
          <h2 className="font-[600] text-center text-[24px] flex flex-col">
            Sales accounting
          </h2>
        </NavLink>
      </div>
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
          <Button onClick={() => logout()} className="w-full">
            Log out
          </Button>
        )}
      </div>
    </aside>
  );
};