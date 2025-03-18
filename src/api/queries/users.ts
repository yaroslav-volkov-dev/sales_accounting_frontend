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

export type RefreshSessionResponse = {
  accessToken: string,
  user: UserModel
}

export const useUserQuery = () => {
  const token = localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN)

  const queryData = useQuery({
    queryKey: usersQueryKey.auth(),
    queryFn: async () => {
      const response = await axiosInstance.post<RefreshSessionResponse>(ENDPOINTS.USER.REFRESH)
      const accessToken = response?.data?.accessToken

      if (!token) {
        localStorage.removeItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN)
        return
      }

      localStorage.setItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN, accessToken)
      return response
    },

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

type RegistrationResponse = {
  accessToken: string
  user: UserModel
}


export const useRegisterMutation = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (userData: RegistrationDto) =>
      axiosInstance.post<RegistrationResponse>(ENDPOINTS.USER.REGISTER, userData),
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

type LoginResponse = {
  accessToken: string
  user: UserModel
}

export const useLoginMutation = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (userData: LoginDto) => axiosInstance.post<LoginResponse>(ENDPOINTS.USER.LOGIN, userData),
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

const useRefreshSessionMutation = () => {

  return useMutation({
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
    },
    onError: () => {
      localStorage.removeItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN)
      notify({ message: 'Something went wrong, cannot refresh the session' })
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
