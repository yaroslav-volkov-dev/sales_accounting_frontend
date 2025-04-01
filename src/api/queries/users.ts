import { ENDPOINTS } from "@/constants/endpoints"
import { SessionModel } from "@/models"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { toast } from "sonner"
import { axiosInstance } from "../global-config"
import { authQueryKey, UserQueryResponse } from "./auth"
import { categoriesQueryKey } from "./categories"
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

type StartSessionVariables = {
  workspaceId: string
}

export const useStartSessionMutation = () => {
  const client = useQueryClient()

  return useMutation<SessionModel, AxiosError, StartSessionVariables>({
    mutationFn: ({ workspaceId }: StartSessionVariables) => axiosInstance.post(ENDPOINTS.USERS.START_SESSION(workspaceId)),
    onSuccess: (response) => {
      client.setQueryData<UserQueryResponse>(authQueryKey.me(), (oldData) => oldData ? {
        ...oldData,
        session: response,
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
      client.setQueryData<UserQueryResponse>(authQueryKey.me(), (oldData) => oldData ? ({
        ...oldData,
        session: null,
      }) : oldData);

      client.removeQueries({
        queryKey: [
          ...categoriesQueryKey.all,
        ]
      })

      toast.success('Successfully closed session')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}
