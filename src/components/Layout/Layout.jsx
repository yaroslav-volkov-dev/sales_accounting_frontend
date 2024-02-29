import { Outlet } from 'react-router-dom';
import { Sidebar } from '../Sidebar/Sidebar.jsx';

export const Layout = () => {
  return (
    <div className="h-screen flex gap-5">
      <Sidebar />
      <div className="w-full px-5 py-10">
        <Outlet />
      </div>
    </div>
  );
};