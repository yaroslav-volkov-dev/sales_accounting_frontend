import { axiosInstance } from '@/api/global-config'
import { ENDPOINTS } from '@/constants/endpoints.ts'
import { notify } from '@/lib/notify.ts'
import { CreateStoreDto, EditStoreDto, StoreModel } from '@/models'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const storesQueryKey = {
  all: ['stores'] as const,
}

export const useStoresQuery = () =>
  useQuery<StoreModel[]>({
    queryKey: storesQueryKey.all,
    queryFn: async () => axiosInstance.get(ENDPOINTS.STORES),
  })

export const useAddStoreMutation = (args: { onSuccess: () => void } | void) => {
  const { onSuccess } = args || {}

  const client = useQueryClient()

  return useMutation({
    mutationFn: (newStore: CreateStoreDto) =>
      axiosInstance.post(ENDPOINTS.STORES, newStore),
    onSuccess: () => {
      onSuccess?.()
      client.invalidateQueries({ queryKey: storesQueryKey.all })
      toast.success('Store successfully added!')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useDeleteStoreMutation = () => {
  const client = useQueryClient()

  return useMutation({
    mutationFn: (storeId: number) =>
      axiosInstance.delete(`${ENDPOINTS.STORES}/${storeId}`),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: storesQueryKey.all })
      notify({ message: 'Category successfully deleted!' })
    },
    onError: (error) => {
      toast.error(error?.response?.data.message)
    },
  })
}

export const useEditStoreMutation = (
  args: { onSuccess: () => void } | void
) => {
  const { onSuccess } = args || {}

  const client = useQueryClient()

  return useMutation({
    mutationFn: ({ body, id }: { id: number; body: EditStoreDto }) =>
      axiosInstance.put(`${ENDPOINTS.STORES}/${id}`, body),
    onSuccess: () => {
      onSuccess?.()
      client.invalidateQueries({ queryKey: storesQueryKey.all })
      notify({ message: 'Store successfully edited!' })
    },
    onError: ({ message }) => {
      notify({ type: 'error', message })
    },
  })
}
