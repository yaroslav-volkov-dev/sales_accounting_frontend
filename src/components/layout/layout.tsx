import { Outlet } from 'react-router-dom';
import { Header } from '@/components/header/header.tsx';
import { Aside } from "@/components/aside/aside.tsx";

export const Layout = () => {
  return (
    <div className="h-screen grid grid-cols-[300px_1fr]">
      <Aside />
      <div>
        <Header />
        <main className="px-10 py-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};