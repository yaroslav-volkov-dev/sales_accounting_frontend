import { router } from './router/router.jsx';
import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAppQuery } from './api/swrConfig.js';

export const App = () => {
  const { data } = useAppQuery();

  console.log(data);
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
};