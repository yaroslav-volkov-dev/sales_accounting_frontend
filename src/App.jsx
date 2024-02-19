import { router } from './router/router.jsx';
import { RouterProvider } from 'react-router-dom';

export const App = () => {
  return (
    <>
      <RouterProvider router={router}/>
    </>
  );
};