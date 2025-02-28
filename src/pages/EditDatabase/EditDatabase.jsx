import { Paper } from '../../components/Paper/Paper.jsx';
import { useMemo, useState } from 'react';
import { Button } from '../../components/Button/Button.jsx';
import { ModalWindow } from '../../components/ModalWindow/ModalWindow.jsx';
import { Controller, useForm } from 'react-hook-form';
import { Input } from '../../components/Input/Input.jsx';
import { OverlayLoader } from '../../components/OverlayLoader/OverlayLoader.jsx';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { axiosInstance } from '../../api/axiosConfig.js';
import { SelectInput } from '../../components/SelectInput/SelectInput.jsx';
import { useCategoriesQuery } from '../../api/hooks.js';
import { ENDPOINTS } from '../../constants/endpoints.js';
import { productsQueryKey, suppliersQueryKey } from './queries.js';
import { useQueryParams } from '../../hooks/useQueryParams.js';
import { AddCategoryModal } from './components/AddCategoryModal.jsx';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

const columnHelper = createColumnHelper();

export const EditDatabase = () => {
  const { register, handleSubmit, reset: resetCreatingForm, control } = useForm();
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
  const { data: suppliersData } = useQuery({
    queryKey: [suppliersQueryKey.all],
    queryFn: async () => axiosInstance.get(ENDPOINTS.SUPPLIERS),
  });

  const client = useQueryClient();

  const { mutate: addProductMutation } = useMutation({
    mutationFn: (newProduct) => axiosInstance.post(ENDPOINTS.PRODUCTS, newProduct),
    onSuccess: () => {
      client.invalidateQueries([productsQueryKey.all]);
      setIsAddProductModalOpen(false);
      resetCreatingForm();
    },

  });

  const { mutate: deleteProductMutation, isLoading: isDeleteProductLoading } = useMutation({
    mutationFn: (id) => axiosInstance.delete(`${ENDPOINTS.PRODUCTS}/${id}`),
    onSuccess: () => {
      client.invalidateQueries([productsQueryKey.all]);
      setDeletableProduct(null);
    },
  });

  const categoriesOptions = categoriesData?.map(({ name, id }) => ({ value: id, label: name })) || [];
  const suppliersOptions = suppliersData?.map(({ name, id }) => ({ value: id, label: name })) || [];

  const openDeleteModalWindow = (product) => {
    if (!product) return;
    setDeletableProduct(product);
  };


  const deleteProduct = () => {
    console.log(deletableProduct);
    const { id } = deletableProduct;

    if (!id) return;

    deleteProductMutation(id);
  };

  const columns = useMemo(() => [
    columnHelper.accessor('name', {
      header: 'Name',
      cell: ({ getValue }) => getValue(),
    }),
    columnHelper.accessor('price', {
      header: 'Price',
      cell: ({ getValue }) => getValue(),
    }),
    columnHelper.accessor((originalRow) => originalRow?.category?.name, {
      header: 'Category',
      cell: ({ getValue }) => getValue(),
    }),
    columnHelper.accessor((originalRow) => originalRow?.supplier?.name, {
      header: 'Supplier',
      cell: ({ getValue }) => getValue(),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <Button
          onClick={() => openDeleteModalWindow(row.original)}
          className="bg-red-600">
          Delete
        </Button>
      ),
    }),
  ], []);


  const tableInstance = useReactTable({
    data: productsData || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const rows = useMemo(() => tableInstance.getRowModel().rows, [productsData]);
  const headerGroups = useMemo(() => tableInstance.getHeaderGroups(), [productsData]);

  return (
    <>
      <OverlayLoader show={false} />
      <h1>Edit database</h1>
      <div className="flex gap-10 mt-10 min-h-[500px]">
        <div className="flex flex-col gap-3 grow">
          <div className="flex gap-4">
            <Button onClick={() => setIsAddProductModalOpen(true)}>Add product</Button>
            <Button onClick={() => setIsAddCategoryModalOpen(true)}>Add Category</Button>
          </div>
          <Paper className="grow">
            <div className="h-full bg-white border border-gray-300 rounded">
              <table className="w-full border-collapse table-fixed">
                <thead className="border-b border-gray-300">
                {headerGroups.map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th key={header.id} align="left" className="px-3 py-2 border-r border-gray-300 last:border-none">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </th>
                    ))}
                  </tr>
                ))}
                </thead>
                <tbody>
                {rows.map(row => (
                  <tr key={row.id} className="border-b border-gray-300">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-3 py-2 border-r border-gray-300 last:border-none">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
          </Paper>
        </div>
      </div>
      <ModalWindow isOpen={isAddProductModalOpen}>
        <Paper className="w-[600px]">
          <form className="w-full flex flex-col gap-3" onSubmit={handleSubmit(addProductMutation)}>
            <h2>Add product</h2>
            <Input placeholder="Name" {...register('name', { required: true })} />
            <Input type="number" placeholder="Price" {...register('price', { required: true })} />
            <Controller
              control={control}
              name="categoryId"
              render={({ field }) => (
                <SelectInput options={categoriesOptions} onChange={({ value }) => field.onChange(value)} />
              )}
            />
            <Controller
              control={control}
              name="supplierId"
              render={({ field }) => (
                <SelectInput options={suppliersOptions} onChange={({ value }) => field.onChange(value)} />
              )}
            />
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