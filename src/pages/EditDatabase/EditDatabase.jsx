import { CategoriesList } from '../../components/CategoriesList/CategoriesList.jsx';
import { Paper } from '../../components/Paper/Paper.jsx';
import { useProductsQuery } from '../../hooks/useProductsQuery.js';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { EditableProductCard } from './components/EditableProductCard.jsx';
import { Button } from '../../components/Button/Button.jsx';
import { ModalWindow } from '../../components/ModalWindow/ModalWindow.jsx';

const Input = ({ className, ...props }) => {
  return <input className={`h-[36px] px-3 py-1 border border-black rounded-lg ${className}`} {...props} />;
};

export const EditDatabase = () => {
  const [productFilter, setProductFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const { products } = useProductsQuery();
  const { slug = '' } = useParams();
  console.log(slug);


  const filteredProducts = products?.filter(({ name }) => name.toLowerCase().includes(productFilter.toLowerCase()));

  return (
    <>
      <h1>Edit database</h1>
      <div className="flex gap-10 mt-10 min-h-[500px]">
        <div className="flex flex-col gap-3">
          <Input onChange={(event) => setCategoryFilter(event.target.value)} />
          <Paper className="w-[200px] grow bg-primary p-4 shrink-0">
            <CategoriesList filter={categoryFilter} />
          </Paper>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex gap-4">
            <Input className="grow" onChange={(event) => setProductFilter(event.target.value)} />
            <Button onClick={() => setIsAddProductModalOpen(true)}>Add product</Button>
          </div>
          <Paper className="grow">
            <ul
              className="w-full gap-2 grid 2xl:grid-cols-8 xl:grid-cols-6 lg:grid-cols-4 sm:grid-cols-3 bg-primary rounded-xl">
              {filteredProducts?.map(({ name, img, _id }) => (
                <EditableProductCard name={name} img={img} key={_id} />
              ))}
            </ul>
          </Paper>
        </div>
      </div>
      <ModalWindow isOpen={isAddProductModalOpen}>
        <Paper className="flex flex-col w-[600px] gap-3">
          <h2>Add product</h2>
          <Input placeholder="Name" />
          <Input placeholder="Price" />
          <Input placeholder="Description" />
          <Input placeholder="Image" />
          <div className="flex justify-center gap-4">
            <Button>Add product</Button>
            <Button onClick={() => setIsAddProductModalOpen(false)}>Cancel</Button>
          </div>
        </Paper>
      </ModalWindow>
    </>
  );
};