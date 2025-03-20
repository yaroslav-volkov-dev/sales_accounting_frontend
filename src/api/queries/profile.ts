import { axiosInstance } from '@/api/global-config'
import { ENDPOINTS } from '@/constants/endpoints.ts'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

const profileQueryKey = {
  all: ['profile'],
  detail: (userId?: string) => [...profileQueryKey.all, userId] as const,
}

type UpdateProfileDto = {
  firstName?: string
  lastName?: string
  email?: string
  phoneNumber?: string
}

export const useUpdateProfileMutation = () => {
  return useMutation({
    mutationFn: ({ id, userData }: { userData: UpdateProfileDto, id: string }) => axiosInstance.put(ENDPOINTS.PROFILE.UPDATE(id), userData),
    onSuccess: () => {
      toast.success('Profile updated successfully')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}
