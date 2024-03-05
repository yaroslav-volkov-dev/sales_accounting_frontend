import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

const colorScheme = {
  primary: 'bg-button-primary',
};

export const Button = ({ children, className, color = 'primary', ...props }) => {

  return (
    <button
      className={twMerge(clsx('px-3 py-1 rounded text-white', colorScheme[color], className))}
      {...props}
    >
      {children}
    </button>
  );
};