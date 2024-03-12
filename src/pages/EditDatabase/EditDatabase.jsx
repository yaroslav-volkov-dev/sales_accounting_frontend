import { CategoriesList } from '../../components/CategoriesList/CategoriesList.jsx';
import { Paper } from '../../components/Paper/Paper.jsx';
import { Image } from '../../components/Image/Image.jsx';
import { useProductsQuery } from '../../hooks/useProductsQuery.js';
import { useParams } from 'react-router-dom';
import { useState } from 'react';

const Input = ({ className, ...props }) => {
  return <input className={`h-[36px] px-3 py-1 border border-black rounded-lg ${className}`} {...props} />;

};

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
  const [productFilter, setProductFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const { products } = useProductsQuery();
  const { slug = '' } = useParams();
  console.log(slug);

  const filteredProducts = products.filter(({ name }) => name.toLowerCase().includes(productFilter.toLowerCase()));

  return (
    <>
      <h1 className="text-center">Edit database</h1>
      <div className="flex gap-10 mt-10 min-h-[500px]">
        <div className="flex flex-col gap-3">
          <Input onChange={(event) => setCategoryFilter(event.target.value)} />
          <Paper className="w-[200px] grow bg-primary p-4 shrink-0">
            <CategoriesList filter={categoryFilter} />
          </Paper>
        </div>
        <div className="flex flex-col gap-3">
          <Input onChange={(event) => setProductFilter(event.target.value)} />
          <Paper className="grow">
            <ul
              className="w-full gap-2 grid 2xl:grid-cols-8 xl:grid-cols-6 lg:grid-cols-4 sm:grid-cols-3 bg-primary rounded-xl">
              {filteredProducts.map(({ name, img, _id }) => (
                <EditableProductCard name={name} img={img} key={_id} />
              ))}
            </ul>
          </Paper>
        </div>
      </div>
    </>
  );
};