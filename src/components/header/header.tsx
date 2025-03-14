import { useProfileQuery } from '@/api/queries/profile.ts'
import { useAuth } from '@/hooks/use-auth.ts'

export const Header = () => {
  const { userData } = useAuth()

  const { data, isSuccess } = useProfileQuery(userData?.user?.id)

  const fullName = (data?.firstName || '') + (data?.lastName || '')

  console.log(data)

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
