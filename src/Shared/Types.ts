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
  valueType: "boolean" | "array";
  options?: string[];
  selected: boolean | string | string[];
  default: boolean | string | string[];
}
