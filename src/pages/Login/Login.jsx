import { Input } from '../../components/Input/Input.jsx';
import { OverlayLoader } from '../../components/OverlayLoader/OverlayLoader.jsx';
import { useForm } from 'react-hook-form';
import { errorMessageRequired } from '../../utils/infoMessages.js';
import { useAuth } from '../../hooks/useAuth.js';
import { Button } from '../../components/Button/Button.jsx';

export const Login = () => {
  const { register: registerField, handleSubmit, formState: { errors } } = useForm();
  const { login, isLoading } = useAuth();

  const onSubmit = async (data) => {
    await login(data);
  };


  return (
    <>
      <h1 className="text-center">LOGIN</h1>
      <div className="w-full flex justify-center">
        <form className="w-[700px] bg-primary flex flex-col p-5 rounded-xl" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Enter your email"
            labelClassName="mt-2"
            errorMessage={errors.email?.message}
            {...registerField('email', {
              required: errorMessageRequired,
            })}
          />
          <Input
            label="Enter your password"
            labelClassName="mt-2"
            errorMessage={errors.password?.message}
            {...registerField('password', {
              required: errorMessageRequired,
            })}
          />
          <div className="mt-5 flex justify-center">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </div>
      <OverlayLoader show={isLoading} />
    </>
  );
};