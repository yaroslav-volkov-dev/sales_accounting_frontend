import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { axiosInstance } from '@/api/axios-config.ts';
import { productsQueryKey } from '../queries.ts';
import { useCallback, useMemo } from 'react';
import { ENDPOINTS } from '@/constants/endpoints.js';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button.tsx';
import { OverlayLoader } from '@/components/OverlayLoader/OverlayLoader.js';
import { AddProductDialog } from '../components/add-product-dialog.tsx';
import { FiltersController } from '@/components/filters-controller/filters-controller.js';
import { ProductsModel } from "@/models";
import { useProductFiltersState } from "@/hooks/use-products-filters.ts";
import { getQueryStringParams } from "@/lib/get-query-string-params.ts";
import { ConfirmationDialog } from "@/components/confirmation-modal/confirmation-dialog.tsx";
import { EditProductDialog } from "@/pages/edit-database/components/edit-product-dialog.tsx";

const columnHelper = createColumnHelper<ProductsModel>();

export const ProductsPage = () => {
  const {
    updateCategoryFilters,
    updateSupplierFilters,
    state,
    suppliersOptions,
    categoriesOptions
  } = useProductFiltersState();

  const { data: productsData } = useQuery({
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
      return axiosInstance.get<ProductsModel[]>(url);
    },
    select: (response) => response.data
  });

  const client = useQueryClient();

  const { mutate: deleteProductMutation } = useMutation({
    mutationFn: (id: string | number) => axiosInstance.delete(`${ENDPOINTS.PRODUCTS}/${id}`),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [productsQueryKey.all] });
    },
  });

  const deleteProduct = useCallback((product: ProductsModel) => {
    const { id } = product || {};

    if (!id) return;

    deleteProductMutation(id);
  }, [deleteProductMutation]);

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
      cell: ({ row }) => {
        return (
          <div className="flex gap-4">
            <ConfirmationDialog
              onConfirm={() => deleteProduct(row.original)}
              message={`Do you really want to delete '${row.original?.name || ''}' product?`}
              trigger={<Button variant="outline">Delete</Button>}
            />
            <EditProductDialog product={row.original} />
          </div>
        );
      },
    }),
  ], [deleteProduct, productsData]);

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
      <div className="flex gap-10 min-h-[500px]">
        <div className="flex flex-col gap-3 grow">
          <div className="flex gap-3">
            <AddProductDialog />
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
    </>
  );
};