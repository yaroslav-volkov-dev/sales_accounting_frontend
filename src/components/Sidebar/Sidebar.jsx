import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { getCategories } from '../../api/api.js';
import { ModalWindow } from '../ModalWindow/ModalWindow.jsx';

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
        <h2
          className="font-[600] text-center text-[24px] flex flex-col after:w-full after:h-[1px] after:bg-black after:mt-3">
          Shopping list
        </h2>
        <div className="flex flex-col gap-2">
          {categories.map(({ name, slug }) => (
            <NavLink to={slug} key={slug}>{name}</NavLink>
          ))}
        </div>
      </div>
      <button onClick={() => setIsModalOpen(true)}>OPEN MODAL</button>
      <ModalWindow isOpen={isModalOpen}>
        <div className="w-[1000px] min-h-[300px] flex flex-col items-center">
          <div className="flex w-full justify-between">
            <h4>Products</h4>
            <button onClick={() => setIsModalOpen(false)} className="text-[30px]">X</button>
          </div>
        </div>
      </ModalWindow>
    </div>
  );
};