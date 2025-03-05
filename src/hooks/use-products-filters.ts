import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import { z } from 'zod';
import { ProductsQueryFilterKey } from "@/types/products-query.types.ts";

const querySchema = z.object({
  categoriesIds: z
    .string()
    .optional()
    .transform((val) => (val ? JSON.parse(val) : [])),
  withoutCategory: z
    .string()
    .optional()
    .transform((val) => (val === "true"))
});

export const useProductFiltersState = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = queryString.parse(location.search);
  const parsedFilters = querySchema.safeParse(queryParams);
  const selectedIds = parsedFilters.success ? parsedFilters.data.categoriesIds : [];
  const withoutCategory = parsedFilters.success ? parsedFilters.data.withoutCategory : undefined;

  const updateCategoryFilters = ({ ungroupedFilters, groupedFilters }: {
    groupedFilters: Record<ProductsQueryFilterKey, string[]>;
    ungroupedFilters: string[]
  }) => {
    const newQueryParams = queryString.stringify(
      {
        categoriesIds: JSON.stringify(ungroupedFilters),
        withoutCategory: !!groupedFilters[ProductsQueryFilterKey.WITHOUT_CATEGORY]
      },
      { encode: false }
    );
    navigate(`?${newQueryParams}`, { replace: true });
  };

  return { selectedIds, updateCategoryFilters, withoutCategory };
};