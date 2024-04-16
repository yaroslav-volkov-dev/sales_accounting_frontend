import { CategoriesList } from '../../components/CategoriesList/CategoriesList.jsx';
import { Paper } from '../../components/Paper/Paper.jsx';
import { forwardRef, useState } from 'react';
import { Button } from '../../components/Button/Button.jsx';
import { ModalWindow } from '../../components/ModalWindow/ModalWindow.jsx';
import { mutateFetcher, useAppQuery } from '../../api/swrConfig.js';
import { ENDPOINTS } from '../../constants/endpoints.js';
import { EditableProductCard } from './components/EditableProductCard.jsx';
import { useForm } from 'react-hook-form';

const Input = forwardRef(({ className, ...props }, ref) => {
  return <input className={`h-[36px] px-3 py-1 border border-black rounded-lg ${className}`} {...props} ref={ref} />;
});

export const EditDatabase = () => {
  const { register, handleSubmit, formState } = useForm();

  const [productFilter, setProductFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const { data = [], mutate } = useAppQuery(ENDPOINTS.PRODUCTS);

  const addProduct = async (data) => {
    await mutate(mutateFetcher(ENDPOINTS.PRODUCTS, { arg: data }));
    setIsAddProductModalOpen(false);
  };

  const filteredProducts = data?.filter(({ name }) => name.toLowerCase().includes(productFilter.toLowerCase()));

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
        <div className="flex flex-col gap-3 grow">
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
        <Paper className="w-[600px]">
          <form className="w-full flex flex-col gap-3" onSubmit={handleSubmit(addProduct)}>
            <h2>Add product</h2>
            <Input placeholder="Name" {...register('name', { required: true })} />
            <Input placeholder="Price" />
            <Input placeholder="Description" />
            <Input placeholder="Image" />
            <div className="flex justify-center gap-4">
              <Button type="submit">Add product</Button>
              <Button onClick={() => setIsAddProductModalOpen(false)}>Cancel</Button>
            </div>
          </form>
        </Paper>
      </ModalWindow>
    </>
  );
};