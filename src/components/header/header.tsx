import { useUserQuery } from '@/api/queries/users'

export const Header = () => {
  const { data, isSuccess } = useUserQuery()

  const fullName = (data?.user?.firstName || '') + ' ' + (data?.user?.lastName || '')

  return (
    <header className="w-full h-16 border-b border-gray-300 shrink-0 px-4">
      {isSuccess && fullName && (
        <div className="h-full flex items-center text-xl font-semibold">
          Hello, {fullName}!
        </div>
      )}
    </header>
  )
}
