import { useForm } from 'react-hook-form';
import { Input } from '../../components/Input/Input.jsx';
import { axiosInstance } from '../../api/axiosInstance.js';

export const RegistrationPage = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    const { passwordCheck, ...userData } = data;

    try {
      await axiosInstance.post('/auth/register', userData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full flex justify-center">
      <form className="w-[700px] bg-green-200 flex flex-col p-5 rounded-xl" onSubmit={handleSubmit(onSubmit)}>
        <Input label="Enter your name"  {...register('username')} />
        <Input label="Enter your email" labelClassName="mt-4"  {...register('email')} />
        <Input label="Enter your password" labelClassName="mt-4"  {...register('password')} />
        <Input label="Enter your password again" labelClassName="mt-4"  {...register('passwordCheck')} />

        <div className="mt-5 flex justify-center">
          <button type="submit" className="border border-black rounded px-3 py-1">Submit</button>
        </div>
      </form>
    </div>
  );
};