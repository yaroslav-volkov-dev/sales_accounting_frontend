import { BASE_URL } from '../../api/axiosInstance.js';
import clsx from 'clsx';

const defaultImage = {
  url: '', alt: '', title: ''
};

export const ProductCard = ({ name, toggleProduct, isSelected, img = defaultImage }) => {

  return (
    <div
      className={clsx('w-full p-2 border rounded cursor-pointer overflow-hidden', isSelected ? 'bg-green-600' : 'bg-white')}
      onClick={toggleProduct}
    >
      <img src={`${BASE_URL}${img.url}`} alt={img.alt}/>
      {name}
    </div>
  );
};