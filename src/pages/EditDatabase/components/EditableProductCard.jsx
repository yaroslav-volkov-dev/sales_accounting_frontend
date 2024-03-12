import { Image } from '../../../components/Image/Image.jsx';

export const EditableProductCard = ({ name, img }) => {
  return (
    <li className="flex justify-between items-center pl-2 border border-white rounded overflow-hidden">
      <div className="overflow-hidden">
        <p>{name}</p>
      </div>
      <div className="h-[50px] w-[50px] float-left shrink-0 ml-2">
        <Image img={img} className="object-cover" />
      </div>
    </li>
  );
};