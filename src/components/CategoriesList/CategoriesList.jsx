import queryString from 'query-string';
import { useQueryParams } from '../../hooks/useQueryParams.js';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { ENDPOINTS } from '../../constants/endpoints.js';
import { axiosInstance } from '../../api/axiosConfig.js';
import { categoriesQueryKey } from '../../pages/EditDatabase/queries.js';
import { notify } from '../../utils/notify.js';

export const CategoriesList = () => {
  const { setSearchParams } = useQueryParams();
  const client = useQueryClient();

  const { data: categoriesData = [] } = useQuery({
    queryKey: [categoriesQueryKey.all],
    queryFn: async () => axiosInstance.get(ENDPOINTS.CATEGORIES)
  });

  const { mutate: deleteCategory } = useMutation({
    mutationFn: (categoryId) => axiosInstance.delete(`${ENDPOINTS.CATEGORIES}/${categoryId}`),
    onSuccess: () => {
      client.invalidateQueries([categoriesQueryKey.all]);
      notify({ message: 'Category successfully deleted!' });
    }
  });

  const categories = [{ name: 'All', slug: '' }, ...categoriesData];

  const setSearchParamsCategory = (id) => {
    const params = queryString.stringify({ categoryId: id });

    setSearchParams(params);
  };

  return (
    <ul className="flex flex-col gap-2">
      {categories.map(({ name, slug, id }) => (
        <li key={slug} className="flex justify-between items-center">
          <button
            className="flex items-center before:w-[6px] before:h-[6px] before:bg-white before:mr-3 before:rounded-full"
            onClick={() => setSearchParamsCategory(id)}
          >
            {name}
          </button>
          <button onClick={() => deleteCategory(id)}>X</button>
        </li>
      ))}
    </ul>
  );
};