import { CircleAlert } from "lucide-react";
import { twMerge } from "tailwind-merge";
type AlertMessageIconColor = 'error' | 'warning' | 'info' | 'success';

const iconColorsMap: Record<AlertMessageIconColor, string> = {
  error: 'text-red-500',
  warning: 'text-yellow-500',
  info: 'text-blue-500',
  success: 'text-green-500',
}

type AlertMessageProps = {
  message: string;
  iconSize?: number;
  iconColor?: AlertMessageIconColor;
}

export const AlertMessage = ({ message, iconSize = 50, iconColor = 'info' }: AlertMessageProps) => {
  return (
    <div className="h-full flex flex-col justify-center items-center gap-3">
      <CircleAlert size={iconSize} className={iconColorsMap[iconColor]} />
      <span className={twMerge('text-lg font-semibold', iconColorsMap[iconColor])}>{message}</span>
    </div>
  )
}
