import { useActiveShiftQuery } from '@/api/queries'
import { Checkbox } from '@/components/ui/checkbox.tsx'
import { formatCurrency } from '@/lib/format-currency'
import { PaymentMethod, ProductModel, SaleModel } from '@/models'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { BanknoteIcon, CreditCardIcon } from 'lucide-react'
import { useMemo } from 'react'
import { RowActionsCell } from './components/row-actions-cell'
import { ShiftViewTable } from './components/shift-view-table'
const columnHelper = createColumnHelper<SaleModel & { Product: ProductModel }>();

const paymentMethodData: Record<PaymentMethod, { icon: React.ReactNode, label: string }> = {
  [PaymentMethod.CASH]: { icon: <BanknoteIcon className='text-green-500' size={20} />, label: 'Cash' },
  [PaymentMethod.CARD]: { icon: <CreditCardIcon className='text-blue-500' size={20} />, label: 'Card' },
}

export const ShiftView = () => {
  const { data: activeShift, isPending: isActiveShiftPending } = useActiveShiftQuery()

  const columns: ColumnDef<SaleModel>[] = useMemo(
    () =>
      [
        columnHelper.display({
          meta: {
            width: '25px',
          },
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
          cell: ({ getValue }) => {

            return (
              <div className="flex items-center gap-2">
                {paymentMethodData[getValue()]?.icon}
                {paymentMethodData[getValue()]?.label}
              </div>
            )
          },
        }),
        columnHelper.accessor((row) => row.sellingPrice, {
          header: 'Price',
          cell: ({ getValue }) => formatCurrency(getValue()),
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
            return formatCurrency(sellingPrice * quantity)
          },
        }),
        columnHelper.accessor((row) => row.createdAt, {
          header: 'Time',
          cell: () => dayjs().format('HH:mm'),
        }),
        columnHelper.display({
          meta: {
            width: '60px',
          },
          id: 'actions',
          cell: () => <RowActionsCell onEdit={() => { }} onDelete={() => { }} />,
        }),

      ] as Array<ColumnDef<SaleModel, unknown>>,
    []
  )

  const sales = activeShift?.Sale || []

  return (
    <div className="h-full flex flex-col">
      <ShiftViewTable isLoading={isActiveShiftPending} sales={sales || []} columns={columns} />
    </div>
  )
}
