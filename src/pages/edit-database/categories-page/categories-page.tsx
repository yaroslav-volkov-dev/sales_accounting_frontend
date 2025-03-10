import { useCallback, useMemo } from 'react';
import { AddCategoryDialog } from '../components/add-category-dialog.tsx';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { getQueryStringParams } from '@/lib/get-query-string-params.ts';
import { notify } from '@/lib/notify.ts';
import { ConfirmationDialog } from '@/components/confirmation-modal/confirmation-dialog.tsx';
import { CategoryModel } from "@/models";
import { Maybe } from "@/types/utility.types.ts";
import { Button } from "@/components/ui/button.tsx";
import { EditCategoryDialog } from "@/pages/edit-database/components/edit-category-dialog.tsx";
import { ProductsQueryFilterKey } from "@/types/products-query.types.ts";
import { NavLink } from "react-router-dom";
import { EyeIcon } from "lucide-react";
import { useCategoriesQuery, useDeleteCategoryMutation } from "@/api/queries/categories.ts";

const includeCount = true;

const columnHelper = createColumnHelper<CategoryModel>();

export const CategoriesPage = () => {
  const { data: categoriesData } = useCategoriesQuery({ includeCount });

  const { mutate: deleteCategory } = useDeleteCategoryMutation();

  const handleDeleteCategory = useCallback((categoryId: Maybe<number>) => {
    if (!categoryId) {
      notify({ type: 'error', message: 'Category ID is not provided' });
      return;
    }

    deleteCategory(categoryId);
  }, [deleteCategory]);

  const columns = useMemo(() => [
    columnHelper.accessor('name', {
      header: 'Name',
      cell: ({ getValue }) => getValue(),
    }),
    columnHelper.accessor((originalRow) => originalRow?._count?.Product, {
      header: 'In Category',
      cell: ({ getValue, row }) => {
        const value = getValue();

        const url = getQueryStringParams('/edit-database/products', {
          [ProductsQueryFilterKey.CATEGORIES_IDS]: row.original.id
        });

        return (
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold">{value}</span>
            {value > 0 && (
              <NavLink to={url} className="relative top-[1px]">
                <EyeIcon size={20} className="hover:text-blue-500" />
              </NavLink>
            )}
          </div>
        );
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-4">
          <ConfirmationDialog
            onConfirm={() => handleDeleteCategory(row.original?.id)}
            message={`Do you really want to delete '${row.original?.name || ''}' category?`}
            trigger={<Button variant="outline">Delete</Button>}
          />
          <EditCategoryDialog category={row.original} />
        </div>
      ),
    }),
  ], [handleDeleteCategory, categoriesData]);


  const tableInstance = useReactTable({
    data: categoriesData || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const rows = useMemo(() => tableInstance.getRowModel().rows, [categoriesData]);
  const headerGroups = useMemo(() => tableInstance.getHeaderGroups(), [categoriesData]);

  return (
    <>
      <div className="flex flex-col items-start gap-3">
        <AddCategoryDialog />
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
                  <td
                    key={cell.id}
                    className="px-3 py-2 border-r border-gray-300 last:border-none"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};