import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { StoreModel } from "@/models/store.model.ts";
import { notify } from "@/lib/notify.ts";
import { useCallback, useMemo } from "react";
import { Maybe } from "@/types/utility.types.ts";
import { ConfirmationDialog } from "@/components/confirmation-modal/confirmation-dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { AddStoreDialog } from "@/pages/edit-database/components/add-store-dialog.tsx";
import { EditStoreDialog } from "@/pages/edit-database/components/edit-store-dialog.tsx";
import { useDeleteStoreMutation, useStoresQuery } from "@/api/queries/stores.ts";

const columnHelper = createColumnHelper<StoreModel>();

export const StoresPage = () => {
  const { data: storesData } = useStoresQuery();

  const { mutate: deleteStore } = useDeleteStoreMutation();

  const handleDeleteCategory = useCallback((categoryId: Maybe<number>) => {
    if (!categoryId) {
      notify({ type: 'error', message: 'Category ID is not provided' });
      return;
    }

    deleteStore(categoryId);
  }, [deleteStore]);

  const columns = useMemo(() => [
    columnHelper.accessor('name', {
      header: 'Name',
      cell: ({ getValue }) => getValue(),
    }),
    columnHelper.accessor('location', {
      header: 'Location',
      cell: ({ getValue }) => getValue()
    }),
    columnHelper.accessor('phoneNumber', {
      header: 'Phone number',
      cell: ({ getValue }) => getValue()
    }),
    columnHelper.display({
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-4">
          <ConfirmationDialog
            onConfirm={() => handleDeleteCategory(row.original?.id)}
            message={`Do you really want to delete '${row.original?.name || ''}' category?`}
            trigger={<Button variant="outline">Delete</Button>}
          />
          <EditStoreDialog store={row.original} />
        </div>
      ),
    }),
  ], [handleDeleteCategory, storesData]);


  const tableInstance = useReactTable({
    data: storesData || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const rows = useMemo(() => tableInstance.getRowModel().rows, [storesData]);
  const headerGroups = useMemo(() => tableInstance.getHeaderGroups(), [storesData]);

  return (
    <>
      <div className="flex flex-col items-start gap-3">
        <AddStoreDialog />
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