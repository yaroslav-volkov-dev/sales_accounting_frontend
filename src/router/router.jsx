import { createBrowserRouter } from 'react-router-dom';
import { MainPage } from '../pages/MainPage/MainPage.jsx';
import { Layout } from '../components/Layout/Layout.jsx';
import { EditDatabase } from '../pages/EditDatabase/EditDatabase.jsx';
import { Registration } from '../pages/Registration/Registration.jsx';
import { AuthorizedRoutes } from './AuthorizedRoutes.jsx';
import { Login } from '../pages/Login/Login.jsx';
import { UnauthorizedRoutes } from './UnauthorizedRoutes.jsx';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    path: '/',
    children: [
      {
        index: true,
        element: <MainPage />,
      },
      {
        element: <AuthorizedRoutes />,
        children: [
          {
            path: '/edit-database',
            element: <EditDatabase />,
          },
        ]
      },
      {
        element: <UnauthorizedRoutes />,
        children: [
          {
            path: '/registration',
            element: <Registration />
          },
          {
            path: '/login',
            element: <Login />
          },
        ]
      },
    ]
  },
  {
    path: '*',
    element: <h1>Not found</h1>
  }
]);
