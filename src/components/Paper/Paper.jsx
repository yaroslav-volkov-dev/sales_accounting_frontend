import { twMerge } from 'tailwind-merge';

export const Paper = ({ children, className }) => (
  <div className={twMerge('w-full bg-primary p-5 rounded-lg', className)}>{children}</div>
);