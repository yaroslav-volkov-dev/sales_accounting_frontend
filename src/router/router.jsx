import { createBrowserRouter } from 'react-router-dom';
import { MainPage } from '../pages/MainPage/MainPage.jsx';
import { Layout } from '../components/Layout/Layout.jsx';
import { EditDatabase } from '../pages/EditDatabase/EditDatabase.jsx';
import { Registration } from '../pages/Registration/Registration.jsx';
import { AuthorizedRoutes } from './AuthorizedRoutes.jsx';
import { Login } from '../pages/Login/Login.jsx';
import { UnauthorizedRoutes } from './UnauthorizedRoutes.jsx';
import { Profile } from '../pages/Profile/Profile.jsx';

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
        path: 'categories/:slug',
        element: <h1> categories/:slug </h1>,
      },
      {
        element: <AuthorizedRoutes />,
        children: [
          {
            path: '/profile',
            element: <Profile />
          }
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
          {
            path: '/edit-database',
            element: <EditDatabase />,
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
