import { toast } from 'react-toastify';

export const notify = (
  {
    message,
    position,
    type = 'success',
    duration = 1000,
  }) => {
  toast[type](message, {
    position,
    autoClose: duration,
  });
};
