import { useActiveShiftQuery } from '@/api/queries'
import { useSalesByShiftQuery } from '@/api/queries/sales'
import { AppTable } from '@/components/app-table/app-table.tsx'
import { Card } from '@/components/ui/card.tsx'
import { Checkbox } from '@/components/ui/checkbox.tsx'
import { SaleModel } from '@/models/sale.model.ts'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { AddSaleDialog } from './components/add-sale-dialog'

const columnHelper = createColumnHelper<SaleModel>()

export const ShiftView = () => {
  const { data: activeShift } = useActiveShiftQuery()
  const { data: sales } = useSalesByShiftQuery(activeShift?.id);

  const columns: ColumnDef<SaleModel>[] = useMemo(
    () =>
      [
        columnHelper.display({
          id: 'select',
          header: ({ table }) => (
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && 'indeterminate')
              }
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
              }
              aria-label="Select all"
            />
          ),
          cell: ({ row }) => (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
            />
          ),
        }),
        columnHelper.accessor((row) => row.Product?.name, {
          header: 'Product Name',
          cell: ({ getValue }) => getValue(),
        }),
        columnHelper.accessor((row) => row.paymentMethod, {
          header: 'Payment Method',
          cell: ({ getValue }) => getValue(),
        }),
        columnHelper.accessor((row) => row.createdAt, {
          header: 'Time',
          cell: () => dayjs().format('HH:mm'),
        }),
        columnHelper.accessor((row) => row.sellingPrice, {
          header: 'Price',
          cell: ({ getValue }) => getValue(),
        }),
        columnHelper.accessor((row) => row.quantity, {
          header: 'Quantity',
          cell: ({ getValue }) => getValue(),
        }),
        columnHelper.display({
          id: 'sum',
          header: 'Sum',
          cell: ({ row }) => {
            const { sellingPrice, quantity } = row?.original || {}
            return sellingPrice * quantity
          },
        }),
      ] as Array<ColumnDef<SaleModel, unknown>>,
    []
  )

  return (
    <div className="h-full flex flex-col">
      <Card className="h-full p-3">
        <div>
          <AddSaleDialog />
        </div>
        <AppTable data={sales || []} columns={columns} />
      </Card>
    </div>
  )
}
