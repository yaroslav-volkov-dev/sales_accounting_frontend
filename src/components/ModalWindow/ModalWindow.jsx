import { createPortal } from 'react-dom';

export const ModalWindow = ({ children, isOpen = false }) => {

  if (!isOpen) return null;

  return createPortal((
    <div className="fixed top-0 bg-black flex justify-center items-center bg-opacity-50 w-screen h-screen">
      {children}
    </div>
  ), document.getElementById('modal'));
};