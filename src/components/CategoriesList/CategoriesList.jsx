import { Link } from '../Link/Link.jsx';
import { useCategoriesQuery } from '../../hooks/useCategoriesQuery.js';

export const CategoriesList = ({ filter }) => {
  const { categories } = useCategoriesQuery();

  const filteredCategories = filter ? categories?.filter(({ name }) => name.toLowerCase().includes(filter.toLowerCase())) : categories;

  return (
    <ul className="flex flex-col gap-2">
      {filteredCategories.map(({ name, slug }) => (
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