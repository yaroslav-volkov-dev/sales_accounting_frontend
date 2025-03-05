import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useMemo, useState } from "react";

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
  initialOptionsIds?: string[];
}

type OptionsMap<Group extends string> = Record<string, Option<Group>>

const prepareDetailedDataForSelectHandler = <Group extends string>(updatedOptionsIds: string[], optionsMap: OptionsMap<Group>): DetailedFiltersState<Group> =>
  updatedOptionsIds.reduce<DetailedFiltersState<Group>>((acc, item) => {
    if (!(item in optionsMap)) return acc;
    const { id, group } = optionsMap[item];

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
    initialOptionsIds = []
  }: FiltersControllerProps<Group>) => {
  const [selectedOptionsIds, setSelectedOptionsIds] = useState<string[]>(initialOptionsIds || []);

  const optionsMap = useMemo(
    () => options.reduce<Record<string, Option<Group>>>((acc, option) => {
      acc[option.id] = option;
      return acc;
    }, {}), [options]);

  const onCheckedChange = (id: string) => {
    const isSelected = selectedOptionsIds.includes(id);
    const updatedOptionsIds = isSelected ? selectedOptionsIds.filter((selectedOptionId) => id !== selectedOptionId) : [...selectedOptionsIds, id];
    const data = prepareDetailedDataForSelectHandler(updatedOptionsIds, optionsMap);

    onSelect(data);
    setSelectedOptionsIds(updatedOptionsIds);
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
                checked={selectedOptionsIds.includes(id)}
                onCheckedChange={() => onCheckedChange(id)}
              />
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
};