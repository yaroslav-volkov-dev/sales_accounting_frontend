import { ENDPOINTS } from "@/constants/endpoints"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { axiosInstance } from "../global-config"
import { authQueryKey } from "./auth"

export const usersQueryKey = {
  all: ['users'],
}

type UpdateProfileDto = {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
}

export const useUserUpdateMutation = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: ({ userData, id }: { userData: UpdateProfileDto, id: string }) => axiosInstance.put(ENDPOINTS.USERS.UPDATE(id), userData),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: authQueryKey.me() })
      toast.success('Successfully updated profile')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useStartSessionMutation = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: ({ workspaceId }: { workspaceId: string }) => axiosInstance.put(ENDPOINTS.USERS.START_SESSION(workspaceId)),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: authQueryKey.me() })
      toast.success('Successfully started session')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}
