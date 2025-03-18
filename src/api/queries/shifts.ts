import { axiosInstance } from '@/api/global-config'
import { useUserQuery } from '@/api/queries/users'
import { ENDPOINTS } from '@/constants/endpoints.ts'
import { notify } from '@/lib/notify.ts'
import { ProductModel, ShiftModel, StoreModel } from '@/models'
import { SaleModel } from '@/models/sale.model'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const shiftKeys = {
  all: ['shifts'] as const,
  active: (userId: string | number) => [...shiftKeys.all, 'active', userId] as const,
}

export type ActiveShiftResponse = ShiftModel & {
  Sale: (SaleModel & { Product: ProductModel })[];
  Store: StoreModel
}

export const useActiveShiftQuery = () => {
  const { userId } = useUserQuery()

  return useQuery({
    queryKey: shiftKeys.active(userId),
    queryFn: async () => axiosInstance.get<ActiveShiftResponse>(
      ENDPOINTS.SHIFTS.ACTIVE(userId || '')
    ),
    enabled: !!userId,
    select: (response) => response.data,
  })
}

type StartShiftMutationVariables = {
  userId: string
  storeId: string
}

export const useStartShiftMutation = (
  args: {
    onSuccess?: () => void
  } | void
) => {
  const client = useQueryClient()

  const { onSuccess } = args || {}

  return useMutation({
    mutationFn: async (variables: StartShiftMutationVariables) =>
      axiosInstance.post(ENDPOINTS.SHIFTS.START, variables),
    onSuccess: (_, variables) => {
      onSuccess?.()
      client.invalidateQueries({ queryKey: shiftKeys.active(variables.userId) })
      notify({ message: 'Shift successfully started!' })
    },
    onError: (error) => {
      notify({
        type: 'error',
        message: error?.message || 'Something went wrong',
      })
    },
  })
}

export const useCloseShiftMutation = (
  args: {
    onSuccess?: () => void
  } | void
) => {
  const client = useQueryClient()

  const { onSuccess } = args || {}

  return useMutation({
    mutationFn: async ({ userId }: { userId: string }) =>
      axiosInstance.post(ENDPOINTS.SHIFTS.CLOSE, { userId }),
    onSuccess: (_, variables) => {
      onSuccess?.()
      client.invalidateQueries({ queryKey: shiftKeys.active(variables.userId) })
      notify({ message: 'Shift successfully ended!' })
    },
    onError: (error) => {
      notify({
        type: 'error',
        message: error?.message || 'Something went wrong',
      })
    },
  })
}
