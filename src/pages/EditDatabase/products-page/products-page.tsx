import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { axiosInstance } from '@/api/axiosConfig.js';
import { productsQueryKey, suppliersQueryKey } from '../queries.ts';
import { useMemo, useState } from 'react';
import { ENDPOINTS } from '@/constants/endpoints.js';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button.tsx';
import { OverlayLoader } from '@/components/OverlayLoader/OverlayLoader.js';
import { ConfirmationModal } from '@/components/ConfirmationModal/ConfirmationModal.js';
import { AddProductModal } from '../components/AddProductModal.tsx';
import { FiltersController } from '@/components/filters-controller/filters-controller.js';
import { CategoryModel, ProductsModel, SupplierModel } from "@/models";
import { useSelectedIds } from "@/hooks/use-categories-filters.ts";
import { getQueryStringParams } from "@/utils/get-query-string-params.ts";

const columnHelper = createColumnHelper<ProductsModel>();

export const ProductsPage = () => {
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [deletableProduct, setDeletableProduct] = useState<ProductsModel | null>(null);

  const { updateCategoryFilters, selectedIds, withoutCategory } = useSelectedIds();

  const { data: productsData } = useQuery<ProductsModel[]>({
    queryKey: [productsQueryKey.categories(selectedIds, withoutCategory)],
    queryFn: async () => {
      const url = getQueryStringParams(
        ENDPOINTS.PRODUCTS,
        {
          categoryIds: selectedIds,
          withoutCategory
        },
        { arrayFormat: 'comma' }
      );
      return axiosInstance.get(url);
    },
  });

  const { data: categoriesData } = useQuery<CategoryModel[]>({
    queryKey: [ENDPOINTS.CATEGORIES],
    queryFn: async () => axiosInstance.get(ENDPOINTS.CATEGORIES)
  });

  const { data: suppliersData } = useQuery<SupplierModel[]>({
    queryKey: [suppliersQueryKey.all],
    queryFn: async () => axiosInstance.get(ENDPOINTS.SUPPLIERS),
  });

  const client = useQueryClient();

  const { mutate: deleteProductMutation, isPending: isDeleteProductLoading } = useMutation({
    mutationFn: (id: string | number) => axiosInstance.delete(`${ENDPOINTS.PRODUCTS}/${id}`),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [productsQueryKey.all] });
      setDeletableProduct(null);
    },
  });

  const categoriesOptions = [
    ...(categoriesData?.map(({ name, id }) => ({ id: `${id}`, label: name })) || []),
    {
      label: 'Without Category',
      id: 'withoutCategory'
    }
  ];

  const suppliersOptions = suppliersData?.map(({ name, id }) => ({ id: `${id}`, label: name })) || [];

  const openDeleteModalWindow = (product: ProductsModel) => {
    if (!product) return;
    setDeletableProduct(product);
  };


  const deleteProduct = () => {
    const { id } = deletableProduct || {};

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
      <div className="flex gap-10 mt-10 min-h-[500px]">
        <div className="flex flex-col gap-3 grow">
          <div className="flex gap-3">
            <Button onClick={() => setIsAddProductModalOpen(true)}>
              Add product
            </Button>
            <FiltersController
              options={categoriesOptions}
              onSelect={updateCategoryFilters}
              controllerName="Categories filters"
              key={JSON.stringify(categoriesOptions)}
            />
            {/*<FiltersController*/}
            {/*  options={suppliersOptions}*/}
            {/*  onSelect={() => {*/}
            {/*    console.log('select');*/}
            {/*  }}*/}
            {/*  controllerName="Supplier filters"*/}
            {/*/>*/}
          </div>
          <div className="h-full bg-white border border-gray-300 rounded">
            <table className="w-full border-collapse table-fixed">
              <thead className="border-b border-gray-300">
              {headerGroups.map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}
                        align="left"
                        className="px-3 py-2 border-r border-gray-300 last:border-none">
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
                <tr key={row.id}
                    className="border-b border-gray-300">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}
                        className="px-3 py-2 border-r border-gray-300 last:border-none">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <AddProductModal
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
      />
      <ConfirmationModal
        isOpen={!!deletableProduct}
        onConfirm={deleteProduct}
        isLoading={isDeleteProductLoading}
        onCancel={() => setDeletableProduct(null)}
        message={`Do you really want to delete '${deletableProduct?.name || ''}' product?`}
      />
    </>
  );
};