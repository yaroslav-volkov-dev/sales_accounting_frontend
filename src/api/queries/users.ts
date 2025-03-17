import { ENDPOINTS } from '@/constants/endpoints'
import { UserModel } from '@/models'
import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '../axios-config'

const usersQueryKey = {
  all: ['users'] as const,
  list: (filters: string) => [...usersQueryKey.all, filters] as const,
}

type UsersQueryResponse = UserModel[]

export const useUsersListQuery = () => {
  return useQuery({
    queryKey: usersQueryKey.all,
    queryFn: () => axiosInstance.get<UsersQueryResponse>(ENDPOINTS.USER.BASE),
    select: (response) => response.data,
  })
}