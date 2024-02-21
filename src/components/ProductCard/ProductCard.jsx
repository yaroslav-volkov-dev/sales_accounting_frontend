import clsx from 'clsx';
import { Image } from '../Image/Image.jsx';

const defaultImage = {
  url: '', alt: '', title: ''
};

export const ProductCard = ({ name, toggleProduct, isSelected, img = defaultImage }) => {

  return (
    <div
      className={clsx('w-full p-2 border rounded cursor-pointer overflow-hidden', isSelected ? 'bg-green-600' : 'bg-white')}
      onClick={toggleProduct}
    >
      <Image img={img}/>
      {name}
    </div>
  );
};