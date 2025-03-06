import { ReactNode } from "react";

type Container = {
  children: ReactNode
}

export const Container = ({ children }: Container) => {
  return (
    <div className="container h-full mx-auto px-4">
      {children}
    </div>
  );
};