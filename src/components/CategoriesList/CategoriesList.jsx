import { useCategoriesQuery } from '../../api/hooks.js';
import queryString from 'query-string';
import { useQueryParams } from '../../hooks/useQueryParams.js';

export const CategoriesList = () => {
  const { setSearchParams } = useQueryParams();

  const { data: categoriesData = [] } = useCategoriesQuery();

  const categories = [{ name: 'All', slug: '' }, ...categoriesData];

  const setSearchParamsCategory = (id) => {
    const params = queryString.stringify({ categoryId: id });

    setSearchParams(params);
  };

  return (
    <ul className="flex flex-col gap-2">
      {categories.map(({ name, slug, id }) => (
        <li key={slug}>
          <button
            className="flex items-center before:w-[6px] before:h-[6px] before:bg-white before:mr-3 before:rounded-full"
            onClick={() => setSearchParamsCategory(id)}
          >
            {name}
          </button>
        </li>
      ))}
    </ul>
  );
};