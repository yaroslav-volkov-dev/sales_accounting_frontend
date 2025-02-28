import { CategoriesList } from '../../components/CategoriesList/CategoriesList.jsx';
import { Paper } from '../../components/Paper/Paper.jsx';
import { useState } from 'react';
import { Button } from '../../components/Button/Button.jsx';
import { ModalWindow } from '../../components/ModalWindow/ModalWindow.jsx';
import { EditableProductRow } from './components/EditableProductCard.jsx';
import { useForm } from 'react-hook-form';
import { Input } from '../../components/Input/Input.jsx';
import { OverlayLoader } from '../../components/OverlayLoader/OverlayLoader.jsx';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { axiosInstance } from '../../api/axiosConfig.js';
import { SelectInput } from '../../components/SelectInput/SelectInput.jsx';
import { useCategoriesQuery } from '../../api/hooks.js';
import { ENDPOINTS } from '../../constants/endpoints.js';
import { productsQueryKey } from './queries.js';
import { useQueryParams } from '../../hooks/useQueryParams.js';
import { AddCategoryModal } from './components/AddCategoryModal.jsx';

export const EditDatabase = () => {
  const { register, handleSubmit, reset: resetCreatingForm } = useForm();
  const [productFilter, setProductFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [deletableProduct, setDeletableProduct] = useState(null);

  const { searchParams } = useQueryParams();
  const categoryId = searchParams.get('categoryId');


  const { data: productsData } = useQuery({
    queryKey: [productsQueryKey.category(categoryId)],
    queryFn: async () => axiosInstance.get(`${ENDPOINTS.PRODUCTS}`, {
      params: { categoryId }
    }),
  });

  const { data: categoriesData } = useCategoriesQuery();

  const client = useQueryClient();

  const { mutate: addProductMutation } = useMutation({
    mutationFn: (newProduct) => axiosInstance.post(ENDPOINTS.PRODUCTS, newProduct),
    onSuccess: () => {
      client.invalidateQueries([productsQueryKey.all]);
      setIsAddProductModalOpen(false);
      resetCreatingForm();
    }
  });

  const { mutate: deleteProductMutation, isLoading: isDeleteProductLoading } = useMutation({
    mutationFn: (id) => axiosInstance.delete(`${ENDPOINTS.PRODUCTS}/${id}`),
    onSuccess: () => {
      client.invalidateQueries([productsQueryKey.all]);
      setDeletableProduct(null);
    },
  });

  const categoriesOptions = categoriesData?.map(({ name, id }) => ({ value: id, label: name })) || [];

  const openDeleteModalWindow = (product) => {
    if (!product) return;
    setDeletableProduct(product);
  };


  const deleteProduct = () => {
    const { id } = deletableProduct;

    if (!id) return;

    deleteProductMutation(id);
  };


  const filteredProducts = productsData?.filter(({ name }) => name.toLowerCase().includes(productFilter.toLowerCase())) || [];

  return (
    <>
      <OverlayLoader show={false} />
      <h1>Edit database</h1>
      <div className="flex gap-10 mt-10 min-h-[500px]">
        <div className="flex flex-col gap-3">
          <Input onChange={(event) => setCategoryFilter(event.target.value)} />
          <Paper className="w-full grow bg-primary p-4 shrink-0">
            <CategoriesList filter={categoryFilter} />
          </Paper>
        </div>
        <div className="flex flex-col gap-3 grow">
          <div className="flex gap-4">
            <Input className="grow" onChange={(event) => setProductFilter(event.target.value)} />
            <Button onClick={() => setIsAddProductModalOpen(true)}>Add product</Button>
            <Button onClick={() => setIsAddCategoryModalOpen(true)}>Add Category</Button>
          </div>
          <Paper className="grow">
            <ul
              className="w-full flex flex-col gap-2 bg-primary rounded-xl">
              {filteredProducts.map((product) => (
                <EditableProductRow
                  productData={product}
                  key={product.id}
                  openDeleteModalWindow={() => openDeleteModalWindow(product)}
                />
              ))}
            </ul>
          </Paper>
        </div>
      </div>
      <ModalWindow isOpen={isAddProductModalOpen}>
        <Paper className="w-[600px]">
          <form className="w-full flex flex-col gap-3" onSubmit={handleSubmit(addProductMutation)}>
            <h2>Add product</h2>
            <Input placeholder="Name" {...register('name', { required: true })} />
            <SelectInput options={categoriesOptions} />
            <div className="flex justify-center gap-4">
              <Button type="submit">Add product</Button>
              <Button onClick={() => setIsAddProductModalOpen(false)}>Cancel</Button>
            </div>
          </form>
        </Paper>
      </ModalWindow>
      <AddCategoryModal isOpen={isAddCategoryModalOpen} onClose={() => setIsAddCategoryModalOpen(false)} />
      <ModalWindow isOpen={!!deletableProduct}>
        <Paper className="w-[600px] flex flex-col gap-3 items-center">
          <h6>Do you really want to delete this product?</h6>
          {isDeleteProductLoading ? <div className="font-bold">Loading...</div> : (
            <div className="flex gap-3">
              <Button onClick={deleteProduct}>Yep</Button>
              <Button onClick={() => setDeletableProduct(null)} color="error">Nope</Button>
            </div>
          )}
        </Paper>
      </ModalWindow>
    </>
  );
};