import { Paper } from '@/components/Paper/Paper.js';
import { Button } from '@/components/Button/Button.js';
import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ENDPOINTS } from '@/constants/endpoints.js';
import { axiosInstance } from '@/api/axiosConfig.js';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { getQueryStringParams } from '@/utils/get-query-string-params.ts';
import { suppliersQueryKey } from '../queries.ts';
import { notify } from '@/utils/notify.js';
import { ConfirmationModal } from '@/components/ConfirmationModal/ConfirmationModal.js';
import { AddSupplierModal } from '../components/AddSupplierModal.jsx';

const columnHelper = createColumnHelper();

export const SuppliersPage = () => {
  const [isAddSupplierModalOpen, setIsAddSuppliersModalOpen] = useState(false);
  const [deletableCategory, setDeletableCategory] = useState(false);

  const client = useQueryClient();
  const includeCount = true;

  const { data: suppliersData } = useQuery({
    queryKey: [suppliersQueryKey.includeCount(includeCount)],
    queryFn: async () => axiosInstance.get(getQueryStringParams(ENDPOINTS.SUPPLIERS, { includeCount }))
  });

  const { mutate: deleteSupplier, isLoading: isDeleteSupplierLoading } = useMutation({
    mutationFn: (supplierId) => axiosInstance.delete(`${ENDPOINTS.SUPPLIERS}/${supplierId}`),
    onSuccess: () => {
      client.invalidateQueries([suppliersQueryKey.all]);
      notify({ message: 'Supplier successfully deleted!' });
    }
  });

  const openDeleteModalWindow = (supplier) => {
    if (!supplier) return;
    setDeletableCategory(supplier);
  };

  const handleDeleteSupplier = (supplierId) => {
    if (!supplierId) {
      notify({ type: 'error', message: 'Supplier ID is not provided' });
    }

    setDeletableCategory(null);
    deleteSupplier(supplierId);
  };

  const columns = useMemo(() => [
    columnHelper.accessor('name', {
      header: 'Name',
      cell: ({ getValue }) => getValue(),
    }),
    columnHelper.accessor((originalRow) => originalRow?._count?.Product, {
      header: 'Suppliers products',
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
    data: suppliersData || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const rows = useMemo(() => tableInstance.getRowModel().rows, [suppliersData]);
  const headerGroups = useMemo(() => tableInstance.getHeaderGroups(), [suppliersData]);

  return (
    <>
      <div className="flex flex-col items-start mt-10 gap-3">
        <Button onClick={() => setIsAddSuppliersModalOpen(true)}>Add Supplier</Button>
        <Paper>
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
      <AddSupplierModal isOpen={isAddSupplierModalOpen} onClose={() => setIsAddSuppliersModalOpen(false)} />
      <ConfirmationModal
        isOpen={!!deletableCategory}
        onConfirm={() => handleDeleteSupplier(deletableCategory?.id)}
        isLoading={isDeleteSupplierLoading}
        onCancel={() => setDeletableCategory(null)}
        message={`Do you really want to delete '${deletableCategory?.name || ''}' category?`}
      />
    </>
  );
};
