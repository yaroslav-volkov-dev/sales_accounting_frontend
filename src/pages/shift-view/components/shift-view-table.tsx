import { AppTable } from "@/components/app-table/app-table"
import { Loader } from "@/components/loader/loader"
import { Card } from "@/components/ui/card"
import { SaleModel } from "@/models"
import { ColumnDef } from "@tanstack/react-table"
import { AddSaleDialog } from "./add-sale-dialog"

interface ShiftViewTableProps {
  isLoading: boolean
  sales: SaleModel[]
  columns: ColumnDef<SaleModel>[]
}

export const ShiftViewTable = ({ isLoading, sales, columns }: ShiftViewTableProps) => {
  return (
    <Card className="h-full p-3">
      {
        isLoading ? <div className="flex justify-center items-center h-full"><Loader /></div> :
          <>
            <div>
              <AddSaleDialog />
            </div>
            <AppTable data={sales || []} columns={columns} />
          </>
      }
    </Card>
  )
}

