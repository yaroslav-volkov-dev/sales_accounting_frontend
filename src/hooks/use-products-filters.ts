import { useCategoriesQuery } from '@/api/queries/categories.ts'
import { ProductsQueryFilterKey } from '@/types/products-query.types.ts'
import queryString from 'query-string'
import { useLocation, useNavigate } from 'react-router-dom'
import { z } from 'zod'

const querySchema = z.object({
  [ProductsQueryFilterKey.CATEGORY_IDS]: z
    .union([z.string(), z.array(z.string())])
    .transform((val) => (val ? (Array.isArray(val) ? val : [val]) : []))
    .optional(),
  [ProductsQueryFilterKey.WITHOUT_CATEGORY]: z.boolean().optional(),
})

type ProductsFiltersQueryState = z.infer<typeof querySchema>

export const useProductFiltersState = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const { data: categoriesData } = useCategoriesQuery()

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
      [ProductsQueryFilterKey.CATEGORY_IDS]: ungroupedFilters,
      [ProductsQueryFilterKey.WITHOUT_CATEGORY]: groupedFilters[
        ProductsQueryFilterKey.WITHOUT_CATEGORY
      ]
        ? true
        : undefined,
    }))
  }

  return {
    updateCategoryFilters,
    state,
    categoriesOptions,
  }
}
