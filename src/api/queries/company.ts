import { ENDPOINTS } from "@/constants/endpoints"
import { UserModel } from "@/models"
import { useQuery } from "@tanstack/react-query"
import { axiosInstance } from "../global-config"

export const companyQueryKey = {
  all: ['company'] as const,
  users: () => [...companyQueryKey.all, 'users'] as const,
}

export const useUsersListQuery = () => {
  return useQuery({
    queryKey: companyQueryKey.users(),
    queryFn: () => axiosInstance.get<UserModel[]>(ENDPOINTS.COMPANY.PROFILES),
    select: (response) => response.data,
  })
}

