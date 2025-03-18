import { ENDPOINTS } from '@/constants/endpoints'
import { LOCAL_STORAGE_KEY } from '@/constants/local-storage-keys'
import { routes } from '@/constants/routes'
import { notify } from '@/lib/notify'
import { UserModel } from '@/models'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from '../axios-config'

export const usersQueryKey = {
  all: ['users'] as const,
  lists: () => [...usersQueryKey.all, 'list'] as const,
  list: () => [...usersQueryKey.lists()] as const,
  detail: (id: string) => [...usersQueryKey.all, 'detail', id] as const,
  auth: () => [...usersQueryKey.all, 'auth'] as const,
}

type UsersQueryResponse = UserModel[]

export const useUsersListQuery = () => {
  return useQuery({
    queryKey: usersQueryKey.list(),
    queryFn: () => axiosInstance.get<UsersQueryResponse>(ENDPOINTS.USER.BASE),
    select: (response) => response.data,
  })
}

export type SessionResponse = {
  accessToken: string,
  user: UserModel
}

export const useUserQuery = () => {
  const token = localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN)

  const queryData = useQuery({
    queryKey: usersQueryKey.auth(),
    queryFn: async () => await axiosInstance.get<SessionResponse>(ENDPOINTS.USER.ME),
    enabled: !!token,
    select: (response) => response?.data,
  })

  return {
    ...queryData,
    userId: queryData?.data?.user?.id || '',
    isAuth: !!token,
  }
}

type RegistrationDto = {
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
}

export const useRegisterMutation = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (userData: RegistrationDto) =>
      axiosInstance.post<SessionResponse>(ENDPOINTS.USER.REGISTER, userData),
    onSuccess: (response) => {
      localStorage.setItem(
        LOCAL_STORAGE_KEY.ACCESS_TOKEN,
        response.data.accessToken
      )
      navigate(routes.shiftView)
      notify({ message: 'Successfully registered' })
    },
    onError: (error) => {
      notify({ type: 'error', message: error.message })
    },
  })
}

export type LoginDto = {
  email: string
  password: string
}

export const useLoginMutation = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (userData: LoginDto) => axiosInstance.post<SessionResponse>(ENDPOINTS.USER.LOGIN, userData),
    onSuccess: (response) => {
      const token = response.data.accessToken

      if (!token) {
        notify({ type: 'error', message: 'Something went wrong, no token in response' })
        return
      }

      localStorage.setItem(
        LOCAL_STORAGE_KEY.ACCESS_TOKEN,
        token
      )
      navigate(routes.shiftView)
      notify({ message: 'Successfully logged in' })
    },
    onError: (error) => {
      notify({ type: 'error', message: error.message })
    },
  })
}

type UpdateProfileDto = {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
}

export const useProfileUpdateMutation = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: ({ userData, id }: { userData: UpdateProfileDto, id: string }) => axiosInstance.put(ENDPOINTS.USER.UPDATE(id), userData),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: usersQueryKey.all })
      notify({ message: 'Successfully updated profile' })
    },
    onError: (error) => {
      notify({ type: 'error', message: error.message })
    },
  })
}

export const useLogoutMutation = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: () => axiosInstance.post(ENDPOINTS.USER.LOGOUT),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: usersQueryKey.auth() })
      localStorage.removeItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN)
      notify({ message: 'Successfully logged out' })
    },
    onError: () => {
      notify({ type: 'error', message: 'Something went wrong, cannot logout' })
    },
  })
}
