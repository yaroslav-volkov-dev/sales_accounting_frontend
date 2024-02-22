import clsx from 'clsx';
import { createPortal } from 'react-dom';

export const OverlayLoader = ({ show, parentRef, className, opacity = 0.5 }) => {
  if (!show) return null;

  const parentElement = parentRef?.current;
  const portalContainer = parentElement || document.body;

  portalContainer.classList.add('relative');

  return createPortal(
    <div
      className={clsx(parentElement ? 'absolute' : 'fixed', 'flex justify-center items-center top-0 left-0 z-50 h-full w-full', className)}>
      <h1 className="text-red-500 text-[40px]">LOADING...</h1>
      <div className="absolute top-0 left-0 h-full w-full bg-black" style={{ opacity }} />
    </div>,
    portalContainer
  );
};