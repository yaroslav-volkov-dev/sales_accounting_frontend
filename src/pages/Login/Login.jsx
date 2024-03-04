import { Input } from '../../components/Input/Input.jsx';
import { OverlayLoader } from '../../components/OverlayLoader/OverlayLoader.jsx';
import { useForm } from 'react-hook-form';
import { errorMessageRequired } from '../../utils/infoMessages.js';
import { useAuth } from '../../hooks/useAuth.js';
import { Navigate } from 'react-router-dom';

export const Login = () => {
  const { register: registerField, handleSubmit, formState: { errors } } = useForm();
  const { login, isLoading, isAuth } = useAuth();

  const onSubmit = async (data) => {
    await login(data);
  };

  if (isAuth) return <Navigate to="/" />;

  return (
    <>
      <h1>LOGIN PAGE</h1>
      <div className="w-full flex justify-center">
        <form className="w-[700px] bg-green-200 flex flex-col p-5 rounded-xl" onSubmit={handleSubmit(onSubmit)}>
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
            <button type="submit" className="border border-black rounded px-3 py-1">Submit</button>
          </div>
        </form>
      </div>
      <OverlayLoader show={isLoading} />
    </>
  );
};