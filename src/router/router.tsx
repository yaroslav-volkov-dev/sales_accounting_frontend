import { Layout } from '@/components/layout/layout.tsx'
import { routes } from '@/constants/routes'
import { CompanyPage } from '@/pages/company/company-page.tsx'
import { CategoriesPage } from '@/pages/edit-database/categories-page/categories-page.tsx'
import { ProductsPage } from '@/pages/edit-database/products-page/products-page.tsx'
import { StoresPage } from '@/pages/edit-database/stores-page/stores-page.tsx'
import { SuppliersPage } from '@/pages/edit-database/suppliers-page/suppliers-page.tsx'
import { Login } from '@/pages/login/login.tsx'
import { MainPage } from '@/pages/main-page/main-page.tsx'
import { ProfilePage } from '@/pages/profile/profile.page'
import { Registration } from '@/pages/registration/registration.page.tsx'
import { ShiftView } from '@/pages/shift-view/shift-view.tsx'
import { ProtectedRoutes } from '@/router/protected-routes.tsx'
import { UnauthorizedRoutes } from '@/router/unauthorized-routes.tsx'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { EditDatabase } from '../pages/edit-database/edit-database.tsx'

export const router = createBrowserRouter([
  {
    element: <Layout />,
    path: routes.home,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
      {
        element: <ProtectedRoutes />,
        children: [
          {
            path: routes.shiftView,
            element: <ShiftView />,
          },
          {
            path: routes.profile,
            element: <ProfilePage />,
          },
          {
            path: routes.company,
            element: <CompanyPage />,
          },
          {
            path: routes.editDatabase.base,
            element: <EditDatabase />,
            children: [
              {
                index: true,
                element: <Navigate to="products" replace />,
              },
              {
                path: routes.editDatabase.products,
                element: <ProductsPage />,
              },
              {
                path: routes.editDatabase.categories,
                element: <CategoriesPage />,
              },
              {
                path: routes.editDatabase.suppliers,
                element: <SuppliersPage />,
              },
              {
                path: routes.editDatabase.stores,
                element: <StoresPage />,
              },
            ],
          },
        ],
      },
      {
        element: <UnauthorizedRoutes />,
        children: [
          {
            path: routes.registration,
            element: <Registration />,
          },
          {
            path: routes.login,
            element: <Login />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <h1>Not found</h1>,
  },
])
