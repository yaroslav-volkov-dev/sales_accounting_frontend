import clsx from 'clsx';
import { forwardRef } from 'react';

export const Input = forwardRef(({ label = '', labelClassName = '', ...props }, ref) => {
  return (
    <label className={labelClassName}>
      {label}
      <input
        {...props}
        ref={ref}
        className={clsx('border rounded w-full h-8 p-2', props.className)}
      />
    </label>
  );
});