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

export type UserQueryResponse = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  workspaces: {
    id: string;
    name: string;
  }[];
  isSessionActive: boolean;
}

export const useUserQuery = () => {
  const query = useQuery<UserQueryResponse>({
    queryKey: authQueryKey.me(),
    queryFn: async () => await axiosInstance.get(ENDPOINTS.AUTH.ME),
    retryOnMount: false,
  })

  return {
    ...query,
    userId: query?.data?.id || '',
    isAuth: !!query?.data,
    isSessionActive: !!query?.data?.isSessionActive,
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
      toast.success('Successfully logged out')

      client.clear()
    },
    onError: () => {
      toast.error('Something went wrong, cannot logout')
    },
  })
}
