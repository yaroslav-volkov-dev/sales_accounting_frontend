import { useLocation, useNavigate } from 'react-router-dom'
import queryString from 'query-string'
import { z } from 'zod'
import { ProductsQueryFilterKey } from '@/types/products-query.types.ts'
import { useQuery } from '@tanstack/react-query'
import { SupplierModel } from '@/models'
import { ENDPOINTS } from '@/constants/endpoints.ts'
import { axiosInstance } from '@/api/axios-config.ts'
import { suppliersQueryKey } from '@/pages/edit-database/queries.ts'
import { useCategoriesQuery } from '@/api/queries/categories.ts'

const querySchema = z.object({
  [ProductsQueryFilterKey.CATEGORIES_IDS]: z
    .union([z.string(), z.array(z.string())])
    .transform((val) => (val ? (Array.isArray(val) ? val : [val]) : []))
    .optional(),
  [ProductsQueryFilterKey.WITHOUT_CATEGORY]: z.boolean().optional(),
  [ProductsQueryFilterKey.SUPPLIERS_IDS]: z
    .union([z.string(), z.array(z.string())])
    .transform((val) => (val ? (Array.isArray(val) ? val : [val]) : []))
    .optional(),
  [ProductsQueryFilterKey.WITHOUT_SUPPLIER]: z.boolean().optional(),
})

type ProductsFiltersQueryState = z.infer<typeof querySchema>

export const useProductFiltersState = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const { data: categoriesData } = useCategoriesQuery()

  const { data: suppliersData } = useQuery({
    queryKey: [suppliersQueryKey.all],
    queryFn: async () =>
      axiosInstance.get<SupplierModel[]>(ENDPOINTS.SUPPLIERS),
    select: (response) => response.data,
  })

  const queryParams = queryString.parse(location.search, {
    parseBooleans: true,
  })
  const parsedFilters = querySchema.safeParse(queryParams)
  const state: ProductsFiltersQueryState = parsedFilters.success
    ? parsedFilters.data
    : {}

  const categoriesOptions = [
    ...(categoriesData?.map(({ name, id }) => ({ id: `${id}`, label: name })) ||
      []),
    {
      label: 'Without Category',
      id: ProductsQueryFilterKey.WITHOUT_CATEGORY,
      group: ProductsQueryFilterKey.WITHOUT_CATEGORY,
    },
  ]

  const suppliersOptions = [
    ...(suppliersData?.map(({ name, id }) => ({ id: `${id}`, label: name })) ||
      []),
    {
      label: 'Without Supplier',
      id: ProductsQueryFilterKey.WITHOUT_SUPPLIER,
      group: ProductsQueryFilterKey.WITHOUT_SUPPLIER,
    },
  ]

  const updateQueryState = (
    updater: (state: ProductsFiltersQueryState) => ProductsFiltersQueryState
  ) => {
    const nextState = updater(state)

    const newQueryParams = queryString.stringify(nextState, { encode: false })
    navigate(`?${newQueryParams}`, { replace: true })
  }

  const updateCategoryFilters = ({
    ungroupedFilters,
    groupedFilters,
  }: {
    groupedFilters: Record<ProductsQueryFilterKey, string[]>
    ungroupedFilters: string[]
  }) => {
    updateQueryState((state) => ({
      ...state,
      [ProductsQueryFilterKey.CATEGORIES_IDS]: ungroupedFilters,
      [ProductsQueryFilterKey.WITHOUT_CATEGORY]: groupedFilters[
        ProductsQueryFilterKey.WITHOUT_CATEGORY
      ]
        ? true
        : undefined,
    }))
  }

  const updateSupplierFilters = ({
    ungroupedFilters,
    groupedFilters,
  }: {
    groupedFilters: Record<ProductsQueryFilterKey, string[]>
    ungroupedFilters: string[]
  }) =>
    updateQueryState((state) => ({
      ...state,
      [ProductsQueryFilterKey.SUPPLIERS_IDS]: ungroupedFilters,
      [ProductsQueryFilterKey.WITHOUT_SUPPLIER]: groupedFilters[
        ProductsQueryFilterKey.WITHOUT_SUPPLIER
      ]
        ? true
        : undefined,
    }))

  return {
    updateCategoryFilters,
    updateSupplierFilters,
    state,
    categoriesOptions,
    suppliersOptions,
  }
}
