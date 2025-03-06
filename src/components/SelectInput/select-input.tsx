import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { cn } from "@/lib/utils.ts";

type SelectInputProps = {
  options: {
    value: string;
    label: string;
  }[];
  onSelect: (value: string) => void
  triggerClassname?: string;
}

export const SelectInput = ({ options, onSelect, triggerClassname }: SelectInputProps) => {
  return (
    <Select onValueChange={onSelect}>
      <SelectTrigger className={cn('w-full', triggerClassname)}>
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        {options.map(({ value, label }) => (
          <SelectItem value={value} key={value}>{label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};