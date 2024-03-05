import { Outlet } from 'react-router-dom';
import { Header } from '../Header/Header.jsx';

export const Layout = () => {
  return (
    <div className="h-screen flex flex-col gap-4">
      <Header />
      <div className="w-full px-5">
        <Outlet />
      </div>
    </div>
  );
};