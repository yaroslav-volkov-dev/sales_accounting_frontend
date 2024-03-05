import { Link } from '../Link/Link.jsx';
import { useEffect, useState } from 'react';
import { getCategories } from '../../api/api.js';

export const Sidebar = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    void getCategories({
      onSuccess: ({ data }) => setCategories(data)
    });
  }, []);

  return (
    <div className="flex flex-col gap-2">
      {categories.map(({ name, slug }) => (
        <Link to={slug} key={slug}>
          {name}
        </Link>
      ))}
    </div>
  );
};