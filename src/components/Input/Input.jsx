import clsx from 'clsx';
import { forwardRef } from 'react';

export const Input = forwardRef((
  {
    errorMessage = '',
    label = '',
    labelClassName = '',
    ...props
  }, ref) => {
  return (
    <label className={labelClassName}>
      {label}
      <input
        {...props}
        ref={ref}
        className={clsx('h-10 border rounded w-full p-2', props.className)}
      />
      {errorMessage &&
        <p className={clsx('text-red-500 text-[12px] h-[25px]', !errorMessage && 'invisible')}>{errorMessage}</p>}
    </label>
  );
});