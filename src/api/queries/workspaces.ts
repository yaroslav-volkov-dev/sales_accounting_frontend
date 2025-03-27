import { ENDPOINTS } from "@/constants/endpoints"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { axiosInstance } from "../global-config"
import { authQueryKey } from "./auth"

export type CreateWorkspaceDto = {
  organizationName: string
}

export const useCreateWorkspaceMutation = () => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWorkspaceDto) => axiosInstance.post(ENDPOINTS.WORKSPACES.CREATE, data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: authQueryKey.me() })

      toast.success('Workspace created successfully')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}


