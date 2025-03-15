import { Loader } from '@/components/loader/loader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useUserQuery } from '@/hooks/use-auth'
import { errorMessageRequired } from '@/lib/infoMessages'
import { ProfileModel } from '@/models'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const profileSchema = z
  .object({
    username: z
      .string()
      .min(3, { message: 'The min length is 3 characters' })
      .nonempty({ message: errorMessageRequired }),
    email: z
      .string()
      .email({ message: 'This field must be email' })
      .nonempty({ message: errorMessageRequired }),
    firstName: z.string().min(1, { message: errorMessageRequired }),
    lastName: z.string().min(1, { message: errorMessageRequired }),
    phone: z.string(),
  })

type ProfileFormData = z.infer<typeof profileSchema>

type ProfilePageFormProps = {
  data: ProfileModel
}

const ProfilePageForm = ({ data: profileData }: ProfilePageFormProps) => {
  const { register, watch, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: profileData,
  })

  // const { mutate, isPending } = useProfileUpdateMutation()

  const currentValues = watch()

  const isValuesEqual = () => {
    return Object.keys(profileData).every(
      (key) => profileData[key as keyof ProfileFormData] === currentValues[key as keyof ProfileFormData]
    )
  }

  const onSubmit = (data: ProfileFormData) => {
    // mutate({ userId: profileData.id, data })
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
                  <Label>Username</Label>
                  <Input {...register('username')} />
                </div>
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
                  <Input {...register('phone')} />
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

  if (isSuccess) return <ProfilePageForm data={data} />

  return null
}
