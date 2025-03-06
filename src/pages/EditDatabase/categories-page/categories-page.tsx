import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ENDPOINTS } from '@/constants/endpoints.js';
import { axiosInstance } from '@/api/axiosConfig.js';
import { AddCategoryModal } from '../components/add-category-modal.tsx';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { getQueryStringParams } from '@/utils/get-query-string-params.ts';
import { categoriesQueryKey } from '../queries.ts';
import { notify } from '@/utils/notify.ts';
import { ConfirmationModal } from '@/components/confirmation-modal/confirmation-modal.tsx';
import { CategoryModel } from "@/models";
import { Maybe } from "@/types/utility.types.ts";
import { Button } from "@/components/ui/button.tsx";

const columnHelper = createColumnHelper<CategoryModel>();

export const CategoriesPage = () => {
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);

  const client = useQueryClient();
  const includeCount = true;

  const { data: categoriesData } = useQuery<CategoryModel[]>({
    queryKey: [categoriesQueryKey.includeCount(includeCount)],
    queryFn: async () => axiosInstance.get(getQueryStringParams(ENDPOINTS.CATEGORIES, { includeCount }))
  });

  const { mutate: deleteCategory } = useMutation({
    mutationFn: (categoryId: number) => axiosInstance.delete(`${ENDPOINTS.CATEGORIES}/${categoryId}`),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [categoriesQueryKey.all] });
      notify({ message: 'Category successfully deleted!' });
    }
  });

  const handleDeleteCategory = (categoryId: Maybe<number>) => {
    if (!categoryId) {
      notify({ type: 'error', message: 'Category ID is not provided' });
      return;
    }

    deleteCategory(categoryId);
  };

  const columns = useMemo(() => [
    columnHelper.accessor('name', {
      header: 'Name',
      cell: ({ getValue }) => getValue(),
    }),
    columnHelper.accessor((originalRow) => originalRow?._count?.Product, {
      header: 'In Category',
      cell: ({ getValue }) => getValue(),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <ConfirmationModal
          onConfirm={() => handleDeleteCategory(row.original?.id)}
          message={`Do you really want to delete '${row.original?.name || ''}' category?`}
          trigger={<Button variant="destructive">Delete</Button>}
        />
      ),
    }),
  ], []);


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
        <Button onClick={() => setIsAddCategoryModalOpen(true)}>Add category</Button>
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
      <AddCategoryModal
        isOpen={isAddCategoryModalOpen}
        onClose={() => setIsAddCategoryModalOpen(false)}
      />
    </>
  );
};