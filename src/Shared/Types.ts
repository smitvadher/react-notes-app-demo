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