import { createPortal } from 'react-dom';
import { PropsWithChildren } from "react";

type ModalWindowProps = PropsWithChildren<{
  isOpen: boolean;
}>

export const ModalWindow = ({ children, isOpen = false }: ModalWindowProps) => {

  if (!isOpen) return null;

  return createPortal((
    <div className="fixed top-0 bg-black/50 flex justify-center items-center w-screen h-screen">
      {children}
    </div>
  ), document.getElementById('modal') || document.body);
};