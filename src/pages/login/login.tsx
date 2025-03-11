import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { errorMessageRequired } from "@/lib/infoMessages.ts";
import { Button } from "@/components/ui/button.tsx";
import { useForm } from "react-hook-form";
import { LoginDto } from "@/types/auth.types.ts";
import { useAuth } from "@/hooks/use-auth.ts";
import { NavLink } from "react-router-dom";

export const Login = () => {
  const { register: registerField, handleSubmit } = useForm<LoginDto>();
  const { login, isLoginLoading } = useAuth();

  return (
    <div className="h-full flex justify-center items-center">
      <div className="w-[600px]">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Login to your account</CardTitle>
              <CardDescription>
                Enter your email below to login to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit((data) => login(data))}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input {...registerField('email', { required: errorMessageRequired })} />
                  </div>
                  <div className="grid gap-3">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      <a
                        href="#"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    </div>
                    <Input {...registerField('password', { required: errorMessageRequired, })} />
                  </div>
                  <div className="flex flex-col gap-3">
                    <Button type="submit" className="w-full" isLoading={isLoginLoading}>
                      Login
                    </Button>
                  </div>
                </div>
                <div className="mt-4 text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <NavLink to="/registration" className="underline underline-offset-4">
                    Sign up
                  </NavLink>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

};