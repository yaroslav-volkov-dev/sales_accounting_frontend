import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useState } from "react";

type Option<Group extends string> = {
  id: string;
  label: string;
  group?: Group;
}

type DetailedFiltersState<Group extends string> = {
  allFilters: string[];
  groupedFilters: Record<Group, string[]>
  ungroupedFilters: string[];
}

type FiltersControllerProps<Group extends string> = {
  controllerName: string;
  options: Option<Group>[];
  onSelect: (filtersState: DetailedFiltersState<Group>) => void;
  initialOptions?: Option<Group>[];
}

const prepareDetailedDataForSelectHandler = <Group extends string>(options: Option<Group>[]): DetailedFiltersState<Group> =>
  options.reduce<DetailedFiltersState<Group>>((acc, {
    group,
    id
  }) => {
    if (!group) acc.ungroupedFilters.push(id);
    if (group) acc.groupedFilters[group] = [...(acc.groupedFilters[group] || []), id];
    acc.allFilters.push(id);
    return acc;
  }, { allFilters: [], ungroupedFilters: [], groupedFilters: {} as Record<Group, string[]> });

export const FiltersController = <Group extends string>(
  {
    options = [],
    controllerName = '',
    onSelect,
    initialOptions = []
  }: FiltersControllerProps<Group>) => {
  const [selectedOptions, setSelectedOptions] = useState<Option<Group>[]>(initialOptions || []);
  const selectedIds = selectedOptions.map(({ id }) => id);

  const onCheckedChange = (option: Option<Group>) => {
    const isSelected = selectedIds.includes(option.id);
    const updatedOptions = isSelected ? selectedOptions.filter(({ id: selectedOptionId }) => option.id !== selectedOptionId) : [...selectedOptions, option];
    const data = prepareDetailedDataForSelectHandler(updatedOptions);

    onSelect(data);
    setSelectedOptions(updatedOptions);
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
          {options.map((option) => (
            <li
              key={option.id}
              className="flex items-center justify-between"
            >
              {option.label}
              <Checkbox
                checked={selectedIds.includes(option.id)}
                onCheckedChange={() => onCheckedChange(option)}
              />
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
};