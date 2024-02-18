import { Outlet } from 'react-router-dom';
import { Sidebar } from '../Sidebar/Sidebar.jsx';

export const Layout = () => {

  return (
  <div className="h-screen">
    <Sidebar/>
    <Outlet/>
  </div>
  )
}