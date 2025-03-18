import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { axiosInstance } from './api/axios-config.ts'
import { ENDPOINTS } from './constants/endpoints.ts'
import { LOCAL_STORAGE_KEY } from './constants/local-storage-keys.ts'
import { routes } from './constants/routes.ts'
import { router } from './router/router.tsx'

const refreshAuthToken = async () => {
  try {
    const response = await axiosInstance.post(ENDPOINTS.USER.REFRESH)
    localStorage.setItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN, response.data.accessToken);
  } catch {
    if (![routes.login, routes.registration].includes(window.location.pathname)) {
      localStorage.removeItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN)
      window.location.href = routes.login
    }
  }
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
      retry: (failureCount, error: any) => {
        if (error?.response?.status === 401) {
          return false;
        }

        return failureCount <= 1;
      },
    },
  },
  queryCache: new QueryCache({
    onError: (error: any) => {
      if (error?.response?.status === 401) {
        refreshAuthToken();
      }
    },
  }),
})

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ToastContainer />
    </QueryClientProvider>
  )
}
