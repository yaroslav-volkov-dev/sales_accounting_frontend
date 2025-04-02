import { ENDPOINTS } from "@/constants/endpoints"
import { getQueryStringParams } from "@/lib/get-query-string-params"
import { CategoryModel, ProductModel } from "@/models/index.ts"
import { ProductsQueryFilterKey } from "@/types/products-query.types"
import { useQuery } from "@tanstack/react-query"
import { axiosInstance } from "../global-config"
type Filters = {
  [ProductsQueryFilterKey.CATEGORY_IDS]?: string[]
  [ProductsQueryFilterKey.WITHOUT_CATEGORY]?: boolean
}

export const productQueryKey = {
  all: ['products'] as const,
  lists: () => [...productQueryKey.all, 'lists'] as const,
  list: (filters?: Filters) => [...productQueryKey.lists(), filters] as const,
}

export type ProductsQueryResponse = (ProductModel & { category: CategoryModel })[]

export const useProductsQuery = (filters?: Filters) => useQuery<ProductsQueryResponse>({
  queryKey: productQueryKey.list(filters),
  queryFn: async () => {
    const url = getQueryStringParams(ENDPOINTS.PRODUCTS, { ...(filters || {}) }, { arrayFormat: 'comma' })

    return axiosInstance.get(url)
  },
})
