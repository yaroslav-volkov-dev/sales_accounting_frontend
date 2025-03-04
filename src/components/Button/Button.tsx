import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

const colorScheme = {
  primary: 'bg-button-primary disabled:bg-button-primary-disabled',
  error: 'bg-red-600 disabled:bg-button-primary-disabled',
};

type ButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  color?: 'primary' | 'error'
}

export const Button = ({ children, className, color = 'primary', ...props }: ButtonProps) => {

  return (
    <button
      className={twMerge(clsx('flex justify-center items-center px-3 py-1 rounded-lg text-white', colorScheme[color], className))}
      {...props}
    >
      {children}
    </button>
  );
};