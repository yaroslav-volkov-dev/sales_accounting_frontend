import { Link } from '../Link/Link.jsx';
import { useEffect } from 'react';
import { useCategoriesStore } from '../../store/useCategoriesStore.js';

export const CategoriesList = () => {
  const fetchCategories = useCategoriesStore(state => state.fetchCategories);
  const categories = useCategoriesStore(state => state.categories);

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <ul className="flex flex-col gap-2">
      {categories.map(({ name, slug }) => (
        <li key={slug}>
          <Link
            className="flex items-center before:w-[6px] before:h-[6px] before:bg-white before:mr-3 before:rounded-full"
            to={slug}>
            {name}
          </Link>
        </li>
      ))}
    </ul>
  );
};