import { useForm } from 'react-hook-form';
import { Input } from '../../components/Input/Input.jsx';
import { OverlayLoader } from '../../components/OverlayLoader/OverlayLoader.jsx';
import { errorMessageRequired } from '../../utils/infoMessages.js';
import { useAuth } from '../../hooks/useAuth.js';
import { Navigate } from 'react-router-dom';

export const Registration = () => {
  const { register: registerField, handleSubmit, formState: { errors } } = useForm();
  const { register, isLoading, isAuth } = useAuth();

  const onSubmit = async (data) => {
    await register(data);
  };

  if (isAuth) return <Navigate to="/" />;

  return (
    <>
      <h1>REGISTRATION PAGE</h1>
      <div className="w-full flex justify-center">
        <form className="w-[700px] bg-green-200 flex flex-col p-5 rounded-xl" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Enter your name"
            errorMessage={errors.username?.message}
            {...registerField('username', {
              required: errorMessageRequired,
              minLength: { value: 3, message: 'The min length is 3 characters' }
            })}
          />
          <Input
            label="Enter your email"
            labelClassName="mt-2"
            errorMessage={errors.email?.message}
            {...registerField('email', {
              required: errorMessageRequired,
              pattern: { value: /\S+@\S+\.\S+/, message: 'This field must be email' }
            })}
          />
          <Input
            label="Enter your password"
            labelClassName="mt-2"
            errorMessage={errors.password?.message}
            {...registerField('password', {
              required: errorMessageRequired,
              minLength: { value: 5, message: 'The min length is 5 characters' },
            })}
          />
          <Input
            label="Enter your password again"
            labelClassName="mt-2"
            errorMessage={errors.confirmPassword?.message}
            {...registerField('confirmPassword', {
              validate: (value, formValues) => {
                if (formValues.password !== value) {
                  return 'Your passwords do no match';
                }
              },
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