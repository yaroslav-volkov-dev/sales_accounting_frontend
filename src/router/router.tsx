import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainPage } from '../pages/MainPage/MainPage.jsx';
import { Layout } from '../components/Layout/Layout.jsx';
import { EditDatabase } from '../pages/EditDatabase/EditDatabase.jsx';
import { Registration } from '../pages/Registration/Registration.jsx';
import { AuthorizedRoutes } from './AuthorizedRoutes.jsx';
import { Login } from '../pages/Login/Login.tsx';
import { UnauthorizedRoutes } from './UnauthorizedRoutes.jsx';
import { ProductsPage } from '@/pages/EditDatabase/products-page/products-page.tsx';
import { CategoriesPage } from '../pages/EditDatabase/CategoriesPage/CategoriesPage.jsx';
import { SuppliersPage } from '../pages/EditDatabase/SuppliersPage/SuppliersPage.jsx';

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
            children: [
              {
                index: true,
                element: <Navigate to="products"
                                   replace />,
              },
              {
                path: 'products',
                element: <ProductsPage />,
              },
              {
                path: 'categories',
                element: <CategoriesPage />,
              },
              {
                path: 'suppliers',
                element: <SuppliersPage />,
              },
            ],
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
