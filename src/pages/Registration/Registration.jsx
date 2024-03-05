import { useForm } from 'react-hook-form';
import { Input } from '../../components/Input/Input.jsx';
import { OverlayLoader } from '../../components/OverlayLoader/OverlayLoader.jsx';
import { errorMessageRequired } from '../../utils/infoMessages.js';
import { useAuth } from '../../hooks/useAuth.js';
import { Paper } from '../../components/Paper/Paper';
import { Button } from '../../components/Button/Button.jsx';

export const Registration = () => {
  const { register: registerField, handleSubmit, formState: { errors } } = useForm();
  const { register, isLoading } = useAuth();

  const onSubmit = async (data) => {
    await register(data);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <h1 className="text-center">REGISTRATION</h1>
      <Paper className="w-[700px]">
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
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
                if (formValues.password !== value) return 'Your passwords do no match';
              },
            })}
          />
          <div className="mt-5 flex justify-center">
            <Button type="submit" className="text-lg">Submit</Button>
          </div>
        </form>
      </Paper>
      <OverlayLoader show={isLoading} />
    </div>
  );
};