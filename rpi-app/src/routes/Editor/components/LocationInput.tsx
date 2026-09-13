import { useState } from "react";

import { Input } from "@/components/ui/input";
import { useCommuneSuggestions } from "@/hooks/useCommuneSuggestions";

export const LocationInput = ({
  id,
  defaultValue,
  onCommit,
}: {
  id: string;
  defaultValue: string;
  onCommit: (value: string) => void;
}) => {
  const [value, setValue] = useState(defaultValue);
  const suggestions = useCommuneSuggestions(value);
  const listId = `${id}-communes`;

  return (
    <>
      <Input
        id={id}
        list={listId}
        defaultValue={defaultValue}
        onChange={(e) => setValue(e.target.value)}
        onBlur={(e) => onCommit(e.target.value)}
      />
      <datalist id={listId}>
        {suggestions.map((nom) => (
          <option key={nom} value={nom} />
        ))}
      </datalist>
    </>
  );
};
