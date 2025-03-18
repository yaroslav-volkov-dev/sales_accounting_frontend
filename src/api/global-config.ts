import { ENDPOINTS } from '@/constants/endpoints'
import { LOCAL_STORAGE_KEY } from '@/constants/local-storage-keys'
import { routes } from '@/constants/routes'
import { Query, QueryCache, QueryClient } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'

export const BASE_URL = 'http://localhost:3000/'

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
})

axiosInstance.interceptors.request.use((config) => {
  const token = window.localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

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
    onError: async (error: Error, query: Query<unknown, unknown, unknown, readonly unknown[]>) => {
      const axiosError = error as AxiosError;
      if (axiosError?.response?.status === 401) {
        try {
          await refreshAuthToken();

          queryClient.refetchQueries({ queryKey: query.queryKey });
        } catch (refreshError) {
          console.error('Failed to refresh token:', refreshError);
        }
      }
    },
  }),
})