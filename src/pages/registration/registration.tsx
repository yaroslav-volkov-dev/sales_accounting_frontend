import { useForm } from 'react-hook-form';
import { errorMessageRequired } from '@/lib/infoMessages';
import { useAuth } from '@/hooks/use-auth.ts';
import { Paper } from '@/components/Paper/Paper.js';
import { Button } from '@/components/ui/button.js';
import { Input } from '@/components/ui/input.js';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const registrationSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'The min length is 3 characters' })
    .nonempty({ message: errorMessageRequired }),

  email: z
    .string()
    .email({ message: 'This field must be email' })
    .nonempty({ message: errorMessageRequired }),

  password: z
    .string()
    .min(5, { message: 'The min length is 5 characters' })
    .nonempty({ message: errorMessageRequired }),

  confirmPassword: z
    .string()
    .nonempty({ message: errorMessageRequired })
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Your passwords do not match',
});

type RegistrationFormData = z.infer<typeof registrationSchema>;


export const Registration = () => {
  const { register, handleSubmit } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  });
  const { registration, isRegistrationPending } = useAuth();

  return (
    <div className="flex flex-col items-center gap-6">
      <h1 className="text-center">REGISTRATION</h1>
      <Paper className="w-[700px]">
        <form className="flex flex-col" onSubmit={handleSubmit((data) => registration(data))}>
          <Input{...register('username')} />
          <Input{...register('email')} />
          <Input{...register('password')} />
          <Input{...register('confirmPassword')} />
          <div className="mt-5 flex justify-center">
            <Button type="submit" isLoading={isRegistrationPending}>Submit</Button>
          </div>
        </form>
      </Paper>
    </div>
  );
};