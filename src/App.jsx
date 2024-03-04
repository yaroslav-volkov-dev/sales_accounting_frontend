import { router } from './router/router.jsx';
import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import { useAuth } from './hooks/useAuth.js';

export const App = () => {
  const { authMe } = useAuth();

  useEffect(() => {
    authMe();
  }, []);

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
};