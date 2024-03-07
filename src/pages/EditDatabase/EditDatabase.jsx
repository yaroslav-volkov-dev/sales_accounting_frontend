import { CategoriesList } from '../../components/CategoriesList/CategoriesList.jsx';
import { useProductsStore } from '../../store/useProductsStore.js';
import { Paper } from '../../components/Paper/Paper.jsx';
import { Image } from '../../components/Image/Image.jsx';

const EditableProductCard = ({ name, img }) => {
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


export const EditDatabase = () => {
  const products = useProductsStore(state => state.products);

  return (
    <>
      <h1 className="text-center">Edit database</h1>
      <div className="flex gap-10 mt-10">
        <div className="min-h-[300px] w-[200px] bg-primary rounded-xl p-4 shrink-0">
          <CategoriesList />
        </div>
        <Paper>
          <ul
            className="w-full gap-2 grid 2xl:grid-cols-8 xl:grid-cols-6 lg:grid-cols-4 sm:grid-cols-3 bg-primary rounded-xl">
            {products.map(({ name, img, _id }) => (
              <EditableProductCard name={name} img={img} key={_id} />
            ))}
          </ul>
        </Paper>
      </div>
    </>
  );
};