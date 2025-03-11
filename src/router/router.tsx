import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainPage } from '@/pages/main-page/main-page.tsx';
import { Layout } from '@/components/layout/layout.tsx';
import { EditDatabase } from '../pages/edit-database/edit-database.tsx';
import { Registration } from '@/pages/registration/registration.tsx';
import { Login } from '@/pages/login/login.tsx';
import { ProductsPage } from '@/pages/edit-database/products-page/products-page.tsx';
import { CategoriesPage } from '@/pages/edit-database/categories-page/categories-page.tsx';
import { SuppliersPage } from '@/pages/edit-database/suppliers-page/suppliers-page.tsx';
import { StoresPage } from "@/pages/edit-database/stores-page/stores-page.tsx";
import { ShiftView } from "@/pages/shift-view/shift-view.tsx";
import { ProtectedRoutes } from "@/router/protected-routes.tsx";
import { UnauthorizedRoutes } from "@/router/unauthorized-routes.tsx";

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
        element: <ProtectedRoutes />,
        children: [
          {
            path: '/shift-view',
            element: <ShiftView />
          },
          {
            path: '/edit-database',
            element: <EditDatabase />,
            children: [
              {
                index: true,
                element: <Navigate to="products" replace />,
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
              {
                path: 'stores',
                element: <StoresPage />,
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
