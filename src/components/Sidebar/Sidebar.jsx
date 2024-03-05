import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { getCategories } from '../../api/api.js';
import { Basket } from '../Basket/Basket.jsx';
import { BasketButton } from '../BasketButton/BasketButton.jsx';
import { useAuth } from '../../hooks/useAuth.js';

const authorizedLinks = [
  {
    label: 'Your profile',
    to: '/profile'
  },
  {
    label: 'Edit database',
    to: '/edit-database',
  }
];

const unauthorizedLinks = [
  {
    label: 'Registration',
    to: '/registration',
  },
  {
    label: 'Login',
    to: '/login',
  },
];


const renderLinks = (links) => links.map(({ to, label }) => <NavLink to={to} key={to}>{label}</NavLink>);

export const Sidebar = () => {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { logout, isAuth, userData } = useAuth();

  const { username } = userData;

  useEffect(() => {
    void getCategories({
      onSuccess: ({ data }) => setCategories(data)
    });
  }, []);


  return (
    <div className="w-80 h-full flex flex-col bg-primary shrink-0 p-4">
      <div className="grow">
        <div className="border-b border-black pb-3">
          <NavLink to="/">
            <h2
              className="font-[600] text-center text-[24px] flex flex-col"
            >
              Shopping list
            </h2>
          </NavLink>
          {username && (
            <p className="text-center font-bold">
              Hello, {userData.username}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 mt-3 after:w-full after:h-[1px] after:bg-black after:mt-3 font-bold">
          {isAuth ? renderLinks(authorizedLinks) : renderLinks(unauthorizedLinks)}
          {isAuth && (
            <button onClick={logout} className="text-left">
              Log out
            </button>
          )}
        </div>
        <div className="flex flex-col gap-2">
          {categories.map(({ name, slug }) => <NavLink to={slug} key={slug}>{name}</NavLink>)}
        </div>
      </div>
      <BasketButton openBasket={() => setIsModalOpen(true)} />
      <Basket isModalOpen={isModalOpen} closeModal={() => setIsModalOpen(false)} />
    </div>
  );
};