import { useMutation, useQueryClient } from "@tanstack/react-query"
import { authQueryKey } from "./auth"

import { ENDPOINTS } from "@/constants/endpoints"
import { SessionModel } from "@/models"
import { AxiosError } from "axios"
import { toast } from "sonner"
import { axiosInstance } from "../global-config"
import { UserQueryResponse } from "./auth"
import { categoriesQueryKey } from "./categories"

type StartSessionVariables = {
  workspaceId: string
}

export const useStartSessionMutation = () => {
  const client = useQueryClient()

  return useMutation<SessionModel, AxiosError, StartSessionVariables>({
    mutationFn: ({ workspaceId }: StartSessionVariables) => axiosInstance.post(ENDPOINTS.SESSIONS.START_SESSION(workspaceId)),
    onSuccess: () => {
      client.setQueryData<UserQueryResponse>(authQueryKey.me(), (oldData) => oldData ? {
        ...oldData,
        isSessionActive: true,
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
    mutationFn: () => axiosInstance.delete(ENDPOINTS.SESSIONS.CLOSE_SESSION),
    onSuccess: () => {
      client.setQueryData<UserQueryResponse>(authQueryKey.me(), (oldData) => oldData ? ({
        ...oldData,
        isSessionActive: false,
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
