import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

const colorScheme = {
  primary: 'bg-button-primary disabled:bg-button-primary-disabled',
  error: 'bg-red-600 disabled:bg-button-primary-disabled',
};

export const Button = ({ children, className, color = 'primary', ...props }) => {

  return (
    <button
      className={twMerge(clsx('flex justify-center items-center px-3 py-1 rounded-lg text-white', colorScheme[color], className))}
      {...props}
    >
      {children}
    </button>
  );
};