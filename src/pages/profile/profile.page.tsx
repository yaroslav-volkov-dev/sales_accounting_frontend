import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const profileSchema = z.object({
  username: z.string().min(1),
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().min(1),
})

type ProfileFormData = z.infer<typeof profileSchema>

export const ProfilePage = () => {

  const { register } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  })

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
          <CardContent>
            <form className="flex flex-col gap-6">
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
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
