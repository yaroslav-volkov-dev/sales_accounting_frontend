import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import { z } from 'zod';

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

export const useSelectedIds = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = queryString.parse(location.search);
  const parsedFilters = querySchema.safeParse(queryParams);
  const selectedIds = parsedFilters.success ? parsedFilters.data.categoriesIds : [];
  const withoutCategory = parsedFilters.success ? parsedFilters.data.withoutCategory : false;


  const updateCategoryFilters = (selectedIds: string[]) => {
    const newQueryParams = queryString.stringify(
      {
        categoriesIds: JSON.stringify(selectedIds.filter((selectedId) => selectedId !== 'withoutCategory')),
        withoutCategory: selectedIds.includes('withoutCategory')
      },
      { encode: false }
    );
    navigate(`?${newQueryParams}`, { replace: true });
  };

  return { selectedIds, updateCategoryFilters, withoutCategory };
};