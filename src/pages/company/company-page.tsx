import { useUsersListQuery } from '@/api/queries/users'
import { AppTable } from '@/components/app-table/app-table'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { UserModel } from '@/models'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { useMemo } from 'react'

const columnHelper = createColumnHelper<UserModel>()

export const CompanyPage = () => {
  const { data: usersListData, } = useUsersListQuery()

  const columns: ColumnDef<UserModel>[] = useMemo(() => [
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
    columnHelper.accessor('firstName', {
      header: 'First Name',
      cell: ({ row }) => row.original.firstName,
    }),
    columnHelper.accessor('lastName', {
      header: 'Last Name',
      cell: ({ row }) => row.original.lastName,
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      cell: ({ row }) => row.original.email,
    }),
    columnHelper.accessor('phoneNumber', {
      header: 'Phone Number',
      cell: ({ row }) => row.original.phoneNumber,
    }),
  ] as ColumnDef<UserModel, unknown>[], [])

  return (
    <Card className='h-full p-3'>
      <AppTable
        columns={columns}
        data={usersListData || []}
      />
    </Card>
  )
}

