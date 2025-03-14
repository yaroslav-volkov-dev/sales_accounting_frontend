import { useQuery } from '@tanstack/react-query'
import { ENDPOINTS } from '@/constants/endpoints.ts'
import { axiosInstance } from '@/api/axios-config.ts'

const profileQueryKey = {
  all: ['profile'],
  detail: (userId?: string) => [...profileQueryKey.all, userId] as const,
}

export const useProfileQuery = (userId?: string) =>
  useQuery({
    queryKey: profileQueryKey.detail(userId),
    queryFn: () => axiosInstance.get(ENDPOINTS.PROFILE.GET_BY_ID(userId)),
    enabled: !!userId,
    select: (response) => response.data,
  })
