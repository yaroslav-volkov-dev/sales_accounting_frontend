import { axiosInstance } from '@/api/global-config.ts'
import { productQueryKey, useProductsQuery } from '@/api/queries/products.ts'
import { ConfirmationDialog } from '@/components/confirmation-modal/confirmation-dialog.tsx'
import { FiltersController } from '@/components/filters-controller/filters-controller.js'
import { OverlayLoader } from '@/components/OverlayLoader/OverlayLoader.js'
import { Button } from '@/components/ui/button.tsx'
import { ENDPOINTS } from '@/constants/endpoints.js'
import { useProductFiltersState } from '@/hooks/use-products-filters.ts'
import { ProductsModel } from '@/models'
import { EditProductDialog } from '@/pages/edit-database/components/edit-product-dialog.tsx'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useCallback, useMemo } from 'react'
import { AddProductDialog } from '../components/add-product-dialog.tsx'
const columnHelper = createColumnHelper<ProductsModel>()

export const ProductsPage = () => {
  const {
    updateCategoryFilters,
    state,
    categoriesOptions,
  } = useProductFiltersState()

  const { data: productsData } = useProductsQuery({ ...state })

  const client = useQueryClient()

  const { mutate: deleteProductMutation } = useMutation({
    mutationFn: (id: string | number) =>
      axiosInstance.delete(`${ENDPOINTS.PRODUCTS}/${id}`),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [productQueryKey.all] })
    },
  })

  const deleteProduct = useCallback(
    (product: ProductsModel) => {
      const { id } = product || {}

      if (!id) return

      deleteProductMutation(id)
    },
    [deleteProductMutation]
  )

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Name',
        cell: ({ getValue }) => getValue(),
      }),
      columnHelper.accessor('price', {
        header: 'Price',
        cell: ({ getValue }) => getValue(),
      }),
      columnHelper.accessor((originalRow) => originalRow?.Category?.name, {
        header: 'Category',
        cell: ({ getValue }) => getValue(),
      }),
      columnHelper.accessor((originalRow) => originalRow?.Supplier?.name, {
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
          )
        },
      }),
    ],
    [deleteProduct, productsData]
  )

  const tableInstance = useReactTable({
    data: productsData || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const rows = useMemo(() => tableInstance.getRowModel().rows, [productsData])
  const headerGroups = useMemo(
    () => tableInstance.getHeaderGroups(),
    [productsData]
  )

  return (
    <>
      <OverlayLoader show={false} />
      <div className="flex gap-10 min-h-[500px]">
        <div className="h-full flex flex-col gap-3 grow">
          <div className="flex gap-3">
            <AddProductDialog />
            <FiltersController
              options={categoriesOptions}
              onSelect={updateCategoryFilters}
              controllerName="Categories filters"
              initialOptionsIds={state.categoryIds}
            />
          </div>
          <div className="grow bg-white border rounded-lg">
            <table className="w-full border-collapse table-fixed">
              <thead className="border-b">
                {headerGroups.map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        align="left"
                        className="px-3 py-2 border-r border-gray-300 last:border-none"
                      >
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
                {rows.map((row) => (
                  <tr key={row.id} className="border-b">
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-3 py-2 border-r border-gray-300 last:border-none"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
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
  )
}
