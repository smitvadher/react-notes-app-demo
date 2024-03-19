import { createContext } from "react";
import { Filter, Note } from "../Shared/Types";

export interface NotesContextProps {
  notes: Note[];
  editingNote: Note | null;
  saveNote: (note: Note) => void;
  deleteNote: (note: Note) => void;
  setEditingNote: (note: Note | null) => void;
  toggleNotePin: (note: Note) => void;
  toggleNoteArchive: (note: Note) => void;

  labels: string[];
  saveLabel: (label: string) => void;
  deleteLabel: (label: string) => void;

  filters: Filter[];
  setFilters: (filters: Filter[]) => void;
}

export const NotesContext = createContext<NotesContextProps | null>(null);
