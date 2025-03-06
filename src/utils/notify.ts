import { toast, ToastPosition } from 'react-toastify';

export type NotificationArgs = {
  message: string;
  position?: ToastPosition;
  type?: 'success' | 'info' | 'error' | 'warn';
  duration?: number;
};

export const notify = (
  {
    message = '',
    position = 'bottom-right',
    type = 'success',
    duration = 1000,
  }: NotificationArgs) => {
  toast[type](message, {
    position,
    autoClose: duration,
  });
};
