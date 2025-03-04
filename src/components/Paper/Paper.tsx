import { twMerge } from 'tailwind-merge';
import { PropsWithChildren } from "react";

type PaperProps = PropsWithChildren<{
  className?: string;
}>

export const Paper = ({ children, className }: PaperProps) => (
  <div className={twMerge('w-full bg-white p-5 rounded-lg', className)}>{children}</div>
);