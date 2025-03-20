import { useUserQuery } from '@/api/queries/auth'
import { useUserUpdateMutation } from '@/api/queries/users'
import { Loader } from '@/components/loader/loader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { errorMessageRequired } from '@/lib/infoMessages'
import { UserModel } from '@/models'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const profileSchema = z
  .object({
    email: z
      .string()
      .email({ message: 'This field must be email' })
      .nonempty({ message: errorMessageRequired }),
    firstName: z.string().nonempty({ message: errorMessageRequired }),
    lastName: z.string().nonempty({ message: errorMessageRequired }),
    phoneNumber: z.string().nonempty({ message: errorMessageRequired }),
  })

type ProfileFormData = z.infer<typeof profileSchema>

type ProfilePageFormProps = {
  data: UserModel
}

const ProfilePageForm = ({ data: profileData }: ProfilePageFormProps) => {
  const { register, watch, handleSubmit } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: profileData,
  })

  const { mutate, isPending } = useUserUpdateMutation()

  const currentValues = watch()

  const isValuesEqual = () => {
    return Object.keys(profileData).every(
      (key) => profileData[key as keyof ProfileFormData] === currentValues[key as keyof ProfileFormData]
    )
  }

  const onSubmit = (data: ProfileFormData) => {
    mutate({ id: profileData.id, userData: data })
  }

  return (
    <div className="h-full flex justify-center items-center">
      <div className="w-[600px]">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Enter your data to register in the service
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label>Email</Label>
                  <Input {...register('email')} />
                </div>
                <div className="grid gap-3">
                  <Label>First Name</Label>
                  <Input {...register('firstName')} />
                </div>
                <div className="grid gap-3">
                  <Label>Last Name</Label>
                  <Input {...register('lastName')} />
                </div>
                <div className="grid gap-3">
                  <Label>Phone</Label>
                  <Input {...register('phoneNumber')} />
                </div>
              </div>
            </CardContent>
            <CardFooter className="mt-10">
              <Button
                type="submit"
                disabled={isValuesEqual()}
                className="w-full"
                isLoading={isPending}
              >
                Save
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

export const ProfilePage = () => {
  const { data, isSuccess, isPending, isError } = useUserQuery()

  if (isPending) {
    return (
      <div className="h-full flex justify-center items-center">
        <Loader size={100} />
      </div>
    )
  }

  if (isError) return (
    <div className="h-full flex justify-center items-center">
      <span className="text-red-500">
        Error
      </span>
    </div>
  )

  if (isSuccess && data?.user) return <ProfilePageForm data={data.user} />

  return null
}
