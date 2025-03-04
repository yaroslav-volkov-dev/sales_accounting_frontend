import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useState } from "react";

type FiltersControllerProps = {
  controllerName: string;
  options: { id: string; label: string }[];
  onSelect: (id: string[]) => void;
}

export const FiltersController = (
  {
    options = [],
    controllerName = '',
    onSelect
  }: FiltersControllerProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(options.map(({ id }) => id));

  const onCheckedChange = (id: string) => {
    const isAlreadySelected = selectedIds.includes(id);

    if (isAlreadySelected) {
      const filteredState = selectedIds.filter((selectedId) => id !== selectedId);
      setSelectedIds(filteredState);
      onSelect(filteredState);
      return;
    }

    const newSelectedIdsArray = [...selectedIds, id];
    setSelectedIds(newSelectedIdsArray);
    onSelect(newSelectedIdsArray);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          {controllerName}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <ul className="flex flex-col gap-2">
          {options.map(({ id, label }) => (
            <li
              key={id}
              className="flex items-center justify-between"
            >
              {label}
              <Checkbox
                checked={selectedIds.includes(id)}
                onCheckedChange={() => onCheckedChange(id)}
              />
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
};