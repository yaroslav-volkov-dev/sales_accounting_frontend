import { routes } from '@/constants/routes.ts'
import { notify } from '@/lib/notify.ts'
import { UpdateProfileDto } from '@/models/user-model.ts'
import {
  LoginDto,
  LoginResponse,
  RefreshSessionResponse,
  RegistrationDto,
  RegistrationResponse,
} from '@/types/auth.types.ts'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from '../api/axios-config.ts'
import { ENDPOINTS } from '../constants/endpoints.ts'
import { LOCAL_STORAGE_KEY } from '../constants/local-storage-keys.ts'

const authQueryKey = {
  all: ['auth'],
}

export const useUserQuery = () => {
  const token = localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN)

  return useQuery({
    queryKey: authQueryKey.all,
    queryFn: async () => {
      const response = await axiosInstance.post<RefreshSessionResponse>(ENDPOINTS.USER.REFRESH)
      const accessToken = response?.data?.accessToken

      if (!token) return

      window.localStorage.setItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN, accessToken)

      return response
    },

    enabled: !!token,
    select: (response) => response?.data,
  })
}

export const useLoginMutation = () => {
  const client = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (userData: LoginDto) => axiosInstance.post<LoginResponse>(ENDPOINTS.USER.LOGIN, userData),
    onSuccess: (response) => {
      localStorage.setItem(
        LOCAL_STORAGE_KEY.ACCESS_TOKEN,
        response.data.access_token
      )
      client.invalidateQueries({ queryKey: authQueryKey.all })

      navigate(routes.shiftView)

      console.log('HAHA');

      notify({ message: 'Successfully logged in' })
    },
    onError: (error) => {
      notify({ type: 'error', message: error.message })
    },
  })
}

export const useProfileUpdateMutation = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: ({ userData, id }: { userData: UpdateProfileDto, id: string }) => axiosInstance.put(ENDPOINTS.USER.UPDATE(id), userData),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: authQueryKey.all })
      notify({ message: 'Successfully updated profile' })
    },
    onError: (error) => {
      notify({ type: 'error', message: error.message })
    },
  })
}

export const useAuth = () => {
  const token = localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN)

  const client = useQueryClient()
  const navigate = useNavigate()

  const { data: userData, isLoading: isUserDataLoading } = useUserQuery()

  const { mutate: login, isPending: isLoginLoading } = useMutation({
    mutationFn: (userData: LoginDto) => axiosInstance.post<LoginResponse>(ENDPOINTS.USER.LOGIN, userData),
    onSuccess: (response) => {
      localStorage.setItem(
        LOCAL_STORAGE_KEY.ACCESS_TOKEN,
        response.data.access_token
      )
      client.invalidateQueries({ queryKey: authQueryKey.all })
      navigate(routes.shiftView)
      notify({ message: 'Successfully logged in' })
    },
    onError: (error) => {
      console.log(error)
      notify({ type: 'error', message: error.message })
    },
  })

  const { mutate: registration, isPending: isRegistrationPending } =
    useMutation({
      mutationFn: (userData: RegistrationDto) =>
        axiosInstance.post<RegistrationResponse>(ENDPOINTS.USER.REGISTER, userData),
      onSuccess: (response) => {
        localStorage.setItem(
          LOCAL_STORAGE_KEY.ACCESS_TOKEN,
          response.data.access_token
        )
        client.invalidateQueries({ queryKey: authQueryKey.all })
        navigate(routes.shiftView)
        notify({ message: 'Successfully registered' })
      },
    })

  const { mutate: refreshSession } = useMutation({
    mutationFn: () =>
      axiosInstance.post<RefreshSessionResponse>(
        ENDPOINTS.USER.REFRESH,
        {},
        { withCredentials: true }
      ),
    onSuccess: (response) => {
      localStorage.setItem(
        LOCAL_STORAGE_KEY.ACCESS_TOKEN,
        response.data.accessToken
      )
      client.invalidateQueries({ queryKey: authQueryKey.all })
    },
    onError: () => {
      localStorage.removeItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN)
      notify({ message: 'Something went wrong, cannot refresh the session' })
    },
  })

  const { mutate: logout, isPending: isLogoutPending } = useMutation({
    mutationFn: () => axiosInstance.post(ENDPOINTS.USER.LOGOUT),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: authQueryKey.all })
      localStorage.removeItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN)
      notify({ message: 'Successfully logged out' })
    },
    onError: () => {
      localStorage.removeItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN)
      notify({ type: 'error', message: 'Something went wrong, cannot logout' })
    },
  })

  return {
    isAuth: !!token,
    login,
    registration,
    userData,
    isUserDataLoading,
    logout,
    refreshSession,
    isLoginLoading,
    isRegistrationPending,
    isLogoutPending,
  }
}
