import { ENDPOINTS } from '@/constants/endpoints'
import { LOCAL_STORAGE_KEY } from '@/constants/local-storage-keys'
import { routes } from '@/constants/routes'
import { UserModel } from '@/models'
import { Query, QueryCache, QueryClient } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'

export const BASE_URL = 'http://localhost:3000/'

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
})

const refreshAuthToken = async () => {
  try {
    const response = await axiosInstance.post<{ user: UserModel }>(ENDPOINTS.USER.REFRESH)

    return response.data
  } catch {
    if (![routes.login, routes.registration].includes(window.location.pathname)) {
      localStorage.removeItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN)
      window.location.href = routes.login
    }
  }
};

export const queryClient = new QueryClient({
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
    onError: (() => {
      let isRetry = false;

      return async (error: Error, query: Query<unknown, unknown, unknown, readonly unknown[]>) => {
        const axiosError = error as AxiosError;

        if (axiosError?.response?.status === 401 && !isRetry) {
          try {
            isRetry = true;
            const response = await refreshAuthToken();
            if (response?.user) {
              queryClient.refetchQueries({ queryKey: query.queryKey });
            }
          } catch (refreshError) {
            isRetry = false;
          }
        }
      };
    })(),
  }),
})