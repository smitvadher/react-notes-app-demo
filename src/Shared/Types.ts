export interface Note {
  id?: string;
  title: string;
  isChecked: boolean;
  isPinned: boolean;
  isArchived: boolean;
  color: string;
  content: string;
  labels: string[];
}

export interface Filter {
  key: keyof Note;
  label: string;
  valueType: "boolean" | "array" | "string";
  options?: any[];
  selected: boolean | string | string[];
  default: boolean | string | string[];
  component?: React.FC<FilterComponentProps>;
}

export interface FilterComponentProps {
  filter: Filter;
  onToggleFilter: (updatedFilter: Filter) => void;
}

export interface Background {
  name: string;
  value: string;
}
