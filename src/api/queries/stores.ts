import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CreateStoreDto, EditStoreDto, StoreModel } from '@/models'
import { axiosInstance } from '@/api/axios-config.ts'
import { ENDPOINTS } from '@/constants/endpoints.ts'
import { notify } from '@/lib/notify.ts'

export const storesQueryKey = {
  all: ['stores'] as const,
}

export const useStoresQuery = () =>
  useQuery({
    queryKey: storesQueryKey.all,
    queryFn: async () => axiosInstance.get<StoreModel[]>(ENDPOINTS.STORES),
    select: (response) => response.data,
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
      notify({ message: 'Store successfully added!' })
    },
    onError: (error) => {
      notify({ message: error.message })
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
    onError: ({ message }) => notify({ type: 'error', message }),
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
