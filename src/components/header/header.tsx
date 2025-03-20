import { useUserQuery } from '@/api/queries/users'
import { Skeleton } from '../ui/skeleton'

const renderGreeting = ({ isAuth, isPending, fullName }: { isAuth: boolean, isPending: boolean, fullName: string }) => {
  if (isPending) {
    return (
      <Skeleton className="w-100 h-9" />
    )
  }
  if (!isAuth) return null

  return (
    <>Hello, {fullName}!</>
  )
}
export const Header = () => {
  const { data, isAuth, isPending } = useUserQuery()

  const fullName = (data?.user?.firstName || '') + ' ' + (data?.user?.lastName || '')

  return (
    <header className="w-full h-16 border-b border-gray-300 shrink-0 px-4">
      <div className="h-full flex items-center text-xl font-semibold">

        {renderGreeting({ isAuth, isPending, fullName })}
      </div>
    </header>
  )
}
