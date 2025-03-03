import { Paper } from '../../../components/Paper/Paper.jsx';
import { Button } from '../../../components/Button/Button.jsx';
import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { ENDPOINTS } from '../../../constants/endpoints.js';
import { axiosInstance } from '../../../api/axiosConfig.js';
import { AddCategoryModal } from '../components/AddCategoryModal.jsx';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { getQueryStringParams } from '../../../utils/getQueryStringParams.js';
import { categoriesQueryKey } from '../queries.js';
import { notify } from '../../../utils/notify.js';
import { ConfirmationModal } from '../../../components/ConfirmationModal/ConfirmationModal.jsx';

const columnHelper = createColumnHelper();

export const CategoriesPage = () => {
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [deletableCategory, setDeletableCategory] = useState(false);

  const client = useQueryClient();
  const includeCount = true;

  const { data: categoriesData } = useQuery({
    queryKey: [categoriesQueryKey.includeCount(includeCount)],
    queryFn: async () => axiosInstance.get(getQueryStringParams(ENDPOINTS.CATEGORIES, { includeCount }))
  });

  const { mutate: deleteCategory, isLoading: isDeleteCategoryLoading } = useMutation({
    mutationFn: (categoryId) => axiosInstance.delete(`${ENDPOINTS.CATEGORIES}/${categoryId}`),
    onSuccess: () => {
      client.invalidateQueries([categoriesQueryKey.all]);
      notify({ message: 'Category successfully deleted!' });
    }
  });

  const openDeleteModalWindow = (category) => {
    if (!category) return;
    setDeletableCategory(category);
  };

  const handleDeleteCategory = (categoryId) => {
    if (!categoryId) {
      notify({ type: 'error', message: 'Category ID is not provided' });
    }

    setDeletableCategory(null);
    deleteCategory(categoryId);
  };

  const columns = useMemo(() => [
    columnHelper.accessor('name', {
      header: 'Name',
      cell: ({ getValue }) => getValue(),
    }),
    columnHelper.accessor((originalRow) => originalRow?._count?.Product, {
      header: 'Products In Category',
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
    data: categoriesData || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const rows = useMemo(() => tableInstance.getRowModel().rows, [categoriesData]);
  const headerGroups = useMemo(() => tableInstance.getHeaderGroups(), [categoriesData]);

  return (
    <>
      <div className="flex flex-col items-start mt-10 gap-3">
        <Button onClick={() => setIsAddCategoryModalOpen(true)}>Add Category</Button>
        <Paper className="">
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
      <AddCategoryModal isOpen={isAddCategoryModalOpen} onClose={() => setIsAddCategoryModalOpen(false)} />
      <ConfirmationModal
        isOpen={!!deletableCategory}
        onConfirm={() => handleDeleteCategory(deletableCategory?.id)}
        isLoading={isDeleteCategoryLoading}
        onCancel={() => setDeletableCategory(null)}
        message={`Do you really want to delete '${deletableCategory?.name || ''}' category?`}
      />
    </>
  );
};