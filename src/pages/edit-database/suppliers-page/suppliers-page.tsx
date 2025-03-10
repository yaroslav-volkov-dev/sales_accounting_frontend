import { useCallback, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ENDPOINTS } from '@/constants/endpoints.js';
import { axiosInstance } from '@/api/axios-config.ts';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { getQueryStringParams } from '@/lib/get-query-string-params.ts';
import { suppliersQueryKey } from '../queries.ts';
import { notify } from '@/lib/notify.ts';
import { ConfirmationDialog } from '@/components/confirmation-modal/confirmation-dialog.tsx';
import { SupplierModel } from "@/models";
import { Button } from "@/components/ui/button.tsx";
import { Maybe } from "@/types/utility.types.ts";
import { AddSupplierDialog } from "@/pages/edit-database/components/add-supplier-dialog.tsx";
import { EditSupplierDialog } from "@/pages/edit-database/components/edit-supplier-dialog.tsx";
import { ProductsQueryFilterKey } from "@/types/products-query.types.ts";
import { NavLink } from "react-router-dom";
import { EyeIcon } from "lucide-react";

const columnHelper = createColumnHelper<SupplierModel>();
const includeCount = true;

export const SuppliersPage = () => {
  const client = useQueryClient();

  const { data: suppliersData } = useQuery<SupplierModel[]>({
    queryKey: [suppliersQueryKey.includeCount(includeCount)],
    queryFn: async () => axiosInstance.get(getQueryStringParams(ENDPOINTS.SUPPLIERS, { includeCount })),
  });

  const { mutate: deleteSupplier } = useMutation({
    mutationFn: (supplierId: number) => axiosInstance.delete(`${ENDPOINTS.SUPPLIERS}/${supplierId}`),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [suppliersQueryKey.all] });
      notify({ message: 'Supplier successfully deleted!' });
    }
  });

  const handleDeleteSupplier = useCallback((supplierId: Maybe<number>) => {
    if (!supplierId) {
      notify({ type: 'error', message: 'Supplier ID is not provided' });
      return;
    }

    deleteSupplier(supplierId);
  }, [deleteSupplier]);

  const columns = useMemo(() => [
    columnHelper.accessor('name', {
      header: 'Name',
      cell: ({ getValue }) => getValue(),
    }),
    columnHelper.accessor((originalRow) => originalRow?.phoneNumber, {
      header: 'Phone',
      cell: ({ getValue }) => getValue(),
    }),
    columnHelper.accessor((originalRow) => originalRow?._count?.Product, {
      header: 'Suppliers products',
      cell: ({ getValue, row }) => {
        const value = getValue();

        const url = getQueryStringParams('/edit-database/products', {
          [ProductsQueryFilterKey.SUPPLIERS_IDS]: row.original.id
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
            onConfirm={() => handleDeleteSupplier(row.original?.id)}
            message={`Do you really want to delete '${row.original?.name || ''}' category?`}
            trigger={<Button variant="outline">Delete</Button>}
          />
          <EditSupplierDialog supplier={row.original} />
        </div>
      ),
    }),
  ], [handleDeleteSupplier, suppliersData]);

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
        <AddSupplierDialog />
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
    </>
  );
};
