import { ENDPOINTS } from '@/constants/endpoints'
import { routes } from '@/constants/routes'
import { UserModel } from '@/models'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { axiosInstance } from '../global-config'

export const authQueryKey = {
  all: ['auth'] as const,
  me: () => [...authQueryKey.all, 'me'] as const,
}

export const useUserQuery = () => {
  const queryData = useQuery({
    queryKey: authQueryKey.me(),
    queryFn: async () => await axiosInstance.get<{ user: UserModel }>(ENDPOINTS.AUTH.ME),
    select: (response) => response?.data,
  })

  return {
    ...queryData,
    userId: queryData?.data?.user?.id || '',
    isAuth: !!queryData?.data?.user,
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
  const client = useQueryClient()

  return useMutation({
    mutationFn: (userData: RegistrationDto) =>
      axiosInstance.post<{ user: UserModel }>(ENDPOINTS.AUTH.REGISTER, userData),
    onSuccess: (response) => {
      client.setQueryData(authQueryKey.me(), response)

      navigate(routes.shiftView)
      toast.success('Successfully registered')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export type LoginDto = {
  email: string
  password: string
}

export const useLoginMutation = () => {
  const navigate = useNavigate()
  const client = useQueryClient()

  return useMutation({
    mutationFn: (userData: LoginDto) => axiosInstance.post<{ user: UserModel }>(ENDPOINTS.AUTH.LOGIN, userData),
    onSuccess: (response) => {
      client.setQueryData(authQueryKey.me(), response)

      navigate(routes.shiftView)
      toast.success('Successfully logged in')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useLogoutMutation = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: () => axiosInstance.post(ENDPOINTS.AUTH.LOGOUT),
    onSuccess: () => {
      client.setQueryData(authQueryKey.me(), null)
      toast.success('Successfully logged out')
    },
    onError: () => {
      toast.error('Something went wrong, cannot logout')
    },
  })
}
