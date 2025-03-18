import { ENDPOINTS } from "@/constants/endpoints"
import { getQueryStringParams } from "@/lib/get-query-string-params"
import { ProductsModel } from "@/models/products.model"
import { useQuery } from "@tanstack/react-query"
import { axiosInstance } from "../global-config"

type Filters = {
  categoryIds: string[]
  withoutCategory: boolean
  suppliersIds: string[]
  withoutSupplier: boolean
}

export const useProductsQuery = (filters?: Filters) => useQuery({
  queryKey: ['products'],
  queryFn: async () => {
    const url = getQueryStringParams(
      ENDPOINTS.PRODUCTS,
      {
        ...(filters || {}),
      },
      { arrayFormat: 'comma' }
    )
    return axiosInstance.get<ProductsModel[]>(url)
  },
  select: (response) => response.data,
})
