import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { axiosInstance } from '@/api/axiosConfig.js';
import { productsQueryKey } from '../queries.ts';
import { useMemo, useState } from 'react';
import { ENDPOINTS } from '@/constants/endpoints.js';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button.tsx';
import { OverlayLoader } from '@/components/OverlayLoader/OverlayLoader.js';
import { ConfirmationModal } from '@/components/ConfirmationModal/ConfirmationModal.js';
import { AddProductModal } from '../components/AddProductModal.tsx';
import { FiltersController } from '@/components/filters-controller/filters-controller.js';
import { ProductsModel } from "@/models";
import { useProductFiltersState } from "@/hooks/use-products-filters.ts";
import { getQueryStringParams } from "@/utils/get-query-string-params.ts";

const columnHelper = createColumnHelper<ProductsModel>();

export const ProductsPage = () => {
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [deletableProduct, setDeletableProduct] = useState<ProductsModel | null>(null);

  const {
    updateCategoryFilters,
    updateSupplierFilters,
    state,
    suppliersOptions,
    categoriesOptions
  } = useProductFiltersState();
  const { data: productsData } = useQuery<ProductsModel[]>({
    queryKey: [productsQueryKey.categories(state.categoriesIds, state.withoutCategory, state.suppliersIds, state.withoutSupplier)],
    queryFn: async () => {
      const url = getQueryStringParams(
        ENDPOINTS.PRODUCTS,
        {
          categoryIds: state.categoriesIds,
          suppliersIds: state.suppliersIds,
          withoutCategory: state.withoutCategory,
          withoutSupplier: state.withoutSupplier,
        },
        { arrayFormat: 'comma' }
      );
      return axiosInstance.get(url);
    },
  });

  const client = useQueryClient();

  const { mutate: deleteProductMutation, isPending: isDeleteProductLoading } = useMutation({
    mutationFn: (id: string | number) => axiosInstance.delete(`${ENDPOINTS.PRODUCTS}/${id}`),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [productsQueryKey.all] });
      setDeletableProduct(null);
    },
  });

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
              initialOptionsIds={state.categoriesIds}
            />
            <FiltersController
              options={suppliersOptions}
              onSelect={updateSupplierFilters}
              controllerName="Suppliers filters"
              initialOptionsIds={state.suppliersIds}
            />
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