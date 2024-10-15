import { Image } from '../../../components/Image/Image.jsx';
import { Button } from '../../../components/Button/Button.jsx';

export const EditableProductCard = ({ name, img, openDeleteModalWindow }) => {

  return (
    <li className="flex flex-col gap-3 pl-2 border border-white rounded overflow-hidden">
      <div className="flex justify-end">
        <Button onClick={openDeleteModalWindow} className="bg-red-600">X</Button>
      </div>
    

      <div className="flex justify-between items-center">
        <div className="overflow-hidden">
          <p>{name}</p>
        </div>
        <div className="h-[50px] w-[50px] float-left shrink-0 ml-2">
          <Image img={img} className="object-cover" />
        </div>
      </div>
    </li>
  );
};