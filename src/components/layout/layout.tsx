import { Outlet } from 'react-router-dom';
import { Aside } from "@/components/aside/aside.tsx";

export const Layout = () => {
  return (
    <div className="h-screen grid grid-cols-[300px_1fr]">
      <Aside />
      <div className="h-full overflow-hidden">
        <main className="h-full px-10 py-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};