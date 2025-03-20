import { ENDPOINTS } from '@/constants/endpoints'
import { routes } from '@/constants/routes'
import { UserModel } from '@/models'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { axiosInstance } from '../global-config'

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

export const useUserQuery = () => {
  const queryData = useQuery({
    queryKey: usersQueryKey.auth(),
    queryFn: async () => await axiosInstance.get<{ user: UserModel }>(ENDPOINTS.USER.ME),
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
      axiosInstance.post<{ user: UserModel }>(ENDPOINTS.USER.REGISTER, userData),
    onSuccess: (response) => {
      client.setQueryData(usersQueryKey.auth(), response)

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
    mutationFn: (userData: LoginDto) => axiosInstance.post<{ user: UserModel }>(ENDPOINTS.USER.LOGIN, userData),
    onSuccess: (response) => {
      client.setQueryData(usersQueryKey.auth(), response)

      navigate(routes.shiftView)
      toast.success('Successfully logged in')
    },
    onError: (error) => {
      toast.error(error.message)
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
      toast.success('Successfully updated profile')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useLogoutMutation = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: () => axiosInstance.post(ENDPOINTS.USER.LOGOUT),
    onSuccess: () => {
      client.setQueryData(usersQueryKey.auth(), null)
      toast.success('Successfully logged out')
    },
    onError: () => {
      toast.error('Something went wrong, cannot logout')
    },
  })
}
