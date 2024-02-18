import { useEffect, useState } from 'react';
import { axiosInstance } from '../../api/axiosInstance.js';
import { NavLink } from 'react-router-dom';

export const Sidebar = () => {
  const [categories, setCategories] = useState([]);

  const getCategories = async () => {
    try {
      const response =  await axiosInstance.get('/categories');
      setCategories(response.data)
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getCategories()
  }, []);

  return (
    <div className="w-80 h-full flex flex-col bg-green-200 shrink-0 p-4">
      <h2 className="font-[600] text-center text-[24px] flex flex-col after:w-full after:h-[1px] after:bg-black after:mt-3">
        Shopping list
      </h2>
      {categories.map(({ name, slug }) => (
        <NavLink to={slug} key={slug}>{name}</NavLink>
      ))}
    </div>
  )
}