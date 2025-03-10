import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils.ts";

type LoaderProps = {
  size?: number;
  className?: string;
}

export const Loader = ({ size = 50, className }: LoaderProps) => (
  <Loader2
    className={cn('animate-spin', className)}
    style={{
      width: size,
      height: size
    }}
  />
);