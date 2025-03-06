import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ENDPOINTS } from '@/constants/endpoints.js';
import { axiosInstance } from '@/api/axiosConfig.js';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { getQueryStringParams } from '@/utils/get-query-string-params.ts';
import { suppliersQueryKey } from '../queries.ts';
import { notify } from '@/utils/notify.ts';
import { ConfirmationModal } from '@/components/confirmation-modal/confirmation-modal.tsx';
import { AddSupplierModal } from '../components/AddSupplierModal.jsx';
import { SupplierModel } from "@/models";
import { Button } from "@/components/ui/button.tsx";
import { Maybe } from "@/types/utility.types.ts";

const columnHelper = createColumnHelper<SupplierModel>();

export const SuppliersPage = () => {
  const [isAddSupplierModalOpen, setIsAddSuppliersModalOpen] = useState(false);

  const client = useQueryClient();
  const includeCount = true;

  const { data: suppliersData } = useQuery<SupplierModel[]>({
    queryKey: [suppliersQueryKey.includeCount(includeCount)],
    queryFn: async () => axiosInstance.get(getQueryStringParams(ENDPOINTS.SUPPLIERS, { includeCount }))
  });

  const { mutate: deleteSupplier } = useMutation({
    mutationFn: (supplierId: number) => axiosInstance.delete(`${ENDPOINTS.SUPPLIERS}/${supplierId}`),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [suppliersQueryKey.all] });
      notify({ message: 'Supplier successfully deleted!' });
    }
  });

  const handleDeleteSupplier = (supplierId: Maybe<number>) => {
    if (!supplierId) {
      notify({ type: 'error', message: 'Supplier ID is not provided' });
      return;
    }

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
        <ConfirmationModal
          onConfirm={() => handleDeleteSupplier(row.original?.id)}
          message={`Do you really want to delete '${row.original?.name || ''}' category?`}
          trigger={<Button variant="destructive">Delete</Button>}
        />
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
      <div className="flex flex-col items-start gap-3">
        <Button onClick={() => setIsAddSuppliersModalOpen(true)}>Add supplier</Button>
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
      </div>
      <AddSupplierModal isOpen={isAddSupplierModalOpen} onClose={() => setIsAddSuppliersModalOpen(false)} />
    </>
  );
};
