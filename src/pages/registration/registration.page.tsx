import { useRegisterMutation } from '@/api/queries/users'
import { Button } from '@/components/ui/button.js'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx'
import { Input } from '@/components/ui/input.js'
import { Label } from '@/components/ui/label.tsx'
import { errorMessageRequired } from '@/lib/infoMessages'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const registrationSchema = z
  .object({
    email: z
      .string()
      .email({ message: 'This field must be email' })
      .nonempty({ message: errorMessageRequired }),
    firstName: z.string().nonempty({ message: errorMessageRequired }),
    lastName: z.string().nonempty({ message: errorMessageRequired }),
    phoneNumber: z.string().nonempty({ message: errorMessageRequired }),
    password: z
      .string()
      .min(5, { message: 'The min length is 5 characters' })
      .nonempty({ message: errorMessageRequired }),
    confirmPassword: z.string().nonempty({ message: errorMessageRequired }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Your passwords do not match',
  })

type RegistrationFormData = z.infer<typeof registrationSchema>

export const Registration = () => {
  const { register, handleSubmit } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  })
  const { mutate: registration, isPending: isRegistrationPending } = useRegisterMutation()

  return (
    <div className="h-full flex justify-center items-center">
      <div className="w-[600px]">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Registration</CardTitle>
              <CardDescription>
                Enter your data to register in the service
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit((data) => registration(data))}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input {...register('email')} />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input {...register('firstName')} />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input {...register('lastName')} />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input {...register('phoneNumber')} />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="password">Password</Label>
                    <Input {...register('password')} />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="password">Confirm Password</Label>
                    <Input {...register('confirmPassword')} />
                  </div>
                  <div className="flex flex-col gap-3">
                    <Button
                      type="submit"
                      className="w-full"
                      isLoading={isRegistrationPending}
                    >
                      Register
                    </Button>
                  </div>
                </div>
                <div className="mt-4 text-center text-sm">
                  Don&apos;t have an account?{' '}
                  <a
                    href="/registration"
                    className="underline underline-offset-4"
                  >
                    Sign up
                  </a>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
