import { useUserQuery } from "@/api/queries/users"
import { ENDPOINTS } from "@/constants/endpoints"
import { notify } from "@/lib/notify"
import { CreateSaleDto, SaleModel } from "@/models/sale.model"
import { Maybe } from "@/types/utility.types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { axiosInstance } from "../axios-config"
import { shiftKeys } from "./shifts"

const salesKeys = {
  all: ['sales'] as const,
  lists: () => [...salesKeys.all, 'lists'] as const,
  list: (shiftId: string | number) => [...salesKeys.lists(), shiftId] as const,
}

export const useSalesByShiftQuery = (shiftId: Maybe<string | number>) => {
  return useQuery({
    queryKey: salesKeys.list(shiftId || ''),
    queryFn: () => axiosInstance.get<SaleModel[]>(ENDPOINTS.SALES.GET_ALL_BY_SHIFT(shiftId || '')),
    select: (response) => response.data,
    enabled: !!shiftId,
  })
}

export const useCreateSaleMutation = (args: { onSuccess?: () => void } | void) => {
  const queryClient = useQueryClient()
  const { onSuccess } = args || {}
  const { userId } = useUserQuery()

  return useMutation({
    mutationFn: ({ sale }: { sale: CreateSaleDto }) => axiosInstance.post(ENDPOINTS.SALES.BASE, sale),
    onSuccess: (_, variables) => {
      console.log('sale created', variables.sale.shiftId)
      queryClient.invalidateQueries({ queryKey: shiftKeys.active(userId || '') })
      notify({ message: 'Sale created successfully' })
      onSuccess?.()
    },
    onError: (error) => {
      notify({ message: error.message, type: 'error' })
    },
  })
}

export const useDeleteSaleMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ saleId }: { saleId: string, shiftId: string }) => axiosInstance.delete(ENDPOINTS.SALES.BASE + '/' + saleId),
    onSuccess: (_, { shiftId }) => {
      queryClient.invalidateQueries({ queryKey: salesKeys.list(shiftId) })
      notify({ message: 'Sale deleted successfully' })
    },
    onError: (error) => {
      notify({ message: error.message, type: 'error' })
    },
  })
}

export const useUpdateSaleMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ sale }: { sale: SaleModel, shiftId: string }) => axiosInstance.put(ENDPOINTS.SALES.BASE + '/' + sale.id, sale),
    onSuccess: (_, { shiftId }) => {
      queryClient.invalidateQueries({ queryKey: salesKeys.list(shiftId) })
      notify({ message: 'Sale updated successfully' })
    },
    onError: (error) => {
      notify({ message: error.message, type: 'error' })
    },
  })
}
