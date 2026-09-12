import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export interface ChecklistOption {
  value: string;
  label: string;
  group?: string;
}

interface ChecklistFieldProps {
  value: string[];
  options: ChecklistOption[];
  onChange: (next: string[]) => void;
}

const toggle = (value: string[], option: string, checked: boolean) =>
  checked ? [...value, option] : value.filter((v) => v !== option);

export const ChecklistField = ({
  value,
  options,
  onChange,
}: ChecklistFieldProps) => {
  const groups = Array.from(
    new Set(options.map((option) => option.group ?? "")),
  );
  const grouped = groups.length > 1 || groups[0] !== "";

  const renderOption = (option: ChecklistOption) => (
    <div key={option.value} className="flex items-center gap-2">
      <Checkbox
        id={`checklist-${option.value}`}
        checked={value.includes(option.value)}
        onCheckedChange={(checked) =>
          onChange(toggle(value, option.value, checked === true))
        }
      />
      <Label htmlFor={`checklist-${option.value}`} className="font-normal">
        {option.label}
      </Label>
    </div>
  );

  if (!grouped) {
    return (
      <div className="flex flex-col gap-2">{options.map(renderOption)}</div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {groups.map((group) => (
        <div key={group} className="flex flex-col gap-2">
          {group && (
            <p className="text-xs font-medium text-muted-foreground/70">
              {group}
            </p>
          )}
          {options
            .filter((option) => (option.group ?? "") === group)
            .map(renderOption)}
        </div>
      ))}
    </div>
  );
};
