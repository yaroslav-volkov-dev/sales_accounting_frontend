import { Card } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { PlusIcon } from "lucide-react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { SaleModel } from "@/models/sale.model.ts";
import { AppTable } from "@/components/app-table/app-table.tsx";
import dayjs from "dayjs";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { useMemo } from "react";

const columnHelper = createColumnHelper<SaleModel>();

const generateRows = (): SaleModel[] => {
  return [...new Array(25)].map((_, index,) => ({
    soldForPrice: 1234,
    id: index,
    Product: {
      name: 'Filter 1',
      price: 234,
      id: 1,
    },
    createdAt: new Date().toDateString(),
    updateAt: '',
    paymentType: 'cash',
    productId: 1,
    sellerId: 2,
    shopId: 3,
    quantity: 12
  }));
};

const mockData: SaleModel[] = generateRows();

export const ShiftView = () => {

  const columns: ColumnDef<SaleModel>[] = useMemo(() => [
    columnHelper.display({
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
    columnHelper.accessor((row) => row.paymentType, {
      header: 'Payment Type',
      cell: ({ getValue }) => getValue(),
    }),
    columnHelper.accessor((row) => row.createdAt, {
      header: 'Time',
      cell: () => dayjs().format("HH:mm"),
    }),
    columnHelper.accessor((row) => row.soldForPrice, {
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
        const { soldForPrice, quantity } = row?.original || {};
        return soldForPrice * quantity;
      },
    }),
  ] as Array<ColumnDef<SaleModel, unknown>>, []);

  return (
    <div className="h-full flex flex-col">
      <Card className="h-full p-3">
        <div>
          <Button>
            Add Sale <PlusIcon strokeWidth={3} />
          </Button>
        </div>
        <AppTable data={mockData} columns={columns} />
      </Card>
    </div>
  );
};