import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { getCategories } from '../../api/api.js';
import { Basket } from '../Basket/Basket.jsx';
import { BasketButton } from '../BasketButton/BasketButton.jsx';

export const Sidebar = () => {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    void getCategories({
      onSuccess: ({ data }) => setCategories(data)
    });
  }, []);

  return (
    <div className="w-80 h-full flex flex-col bg-green-200 shrink-0 p-4">
      <div className="grow">
        <NavLink to="/">
          <h2
            className="font-[600] text-center text-[24px] flex flex-col after:w-full after:h-[1px] after:bg-black after:mt-3"
          >
            Shopping list
          </h2>
        </NavLink>
        <div className="flex flex-col gap-2 mt-3 after:w-full after:h-[1px] after:bg-black after:mt-3 font-bold">
          <NavLink to="/edit-database">Edit database</NavLink>
          <NavLink to="/registration">Registration</NavLink>
        </div>
        <div className="flex flex-col gap-2">
          {categories.map(({ name, slug }) => (
            <NavLink to={slug} key={slug}>{name}</NavLink>
          ))}
        </div>
      </div>
      <BasketButton openBasket={() => setIsModalOpen(true)} />
      <Basket isModalOpen={isModalOpen} closeModal={() => setIsModalOpen(false)} />
    </div>
  );
};