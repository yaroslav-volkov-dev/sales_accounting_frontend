import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils.ts";
import { ShiftController } from "@/components/shift-controller/shift-controller.tsx";
import { Separator } from "@/components/ui/separator.tsx";

export const Aside = () => {
  return (
    <aside className="h-full bg-gray-100 px-4">
      <div className="h-16 flex justify-center items-center">
        <NavLink
          to="/"
          className={({ isActive }) => cn(isActive && 'text-blue-500')}
        >
          <h2 className="font-[600] text-center text-[24px] flex flex-col">
            Sales accounting
          </h2>
        </NavLink>
      </div>
      <Separator />
      <ShiftController />
      <Separator />
    </aside>
  );
};