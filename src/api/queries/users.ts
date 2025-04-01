import { ENDPOINTS } from "@/constants/endpoints"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosResponse } from "axios"
import { toast } from "sonner"
import { axiosInstance } from "../global-config"
import { authQueryKey, UserQueryResponse } from "./auth"

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
    mutationFn: ({ workspaceId }: { workspaceId: string }) => axiosInstance.post(ENDPOINTS.USERS.START_SESSION(workspaceId)),
    onSuccess: (data) => {
      client.setQueryData<AxiosResponse<UserQueryResponse>>(authQueryKey.me(), (oldData) => oldData ? {
        ...oldData,
        session: data.data,
      } : oldData);
      toast.success('Successfully started session')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useCloseSessionMutation = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: () => axiosInstance.delete(ENDPOINTS.USERS.CLOSE_SESSION),
    onSuccess: () => {

      client.setQueryData<AxiosResponse<UserQueryResponse>>(authQueryKey.me(), (oldData) => oldData ? ({
        ...oldData,
        session: null,
      }) : oldData);
      toast.success('Successfully closed session')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}
