import { OverlayLoader } from '@/components/OverlayLoader/OverlayLoader.js';
import { useForm } from 'react-hook-form';
import { errorMessageRequired } from '@/utils/infoMessages.ts';
import { useAuth } from '@/hooks/useAuth.ts';
import { Label } from '@/components/ui/label.js';
import { Input } from '@/components/ui/input.js';
import { Button } from "@/components/ui/button.tsx";
import { LoginRequest } from "@/types/auth.types.ts";

export const Login = () => {
  const { register: registerField, handleSubmit } = useForm<LoginRequest>();
  const { login, isUserDataLoading, isLoginLoading } = useAuth();


  return (
    <>
      <h1 className="text-center">LOGIN</h1>
      <div className="w-full flex justify-center">
        <form
          className="w-[700px] flex flex-col gap-5 p-5 rounded-xl"
          onSubmit={handleSubmit((data: LoginRequest) => void login(data))}
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Enter your email</Label>
            <Input {...registerField('email', {
              required: errorMessageRequired,
            })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Enter your password</Label>
            <Input {...registerField('password', {
              required: errorMessageRequired,
            })}
            />
          </div>
          <div className="mt-5 flex justify-center">
            <Button
              type="submit"
              disabled={isLoginLoading}
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
      <OverlayLoader show={isUserDataLoading} />
    </>
  );
};