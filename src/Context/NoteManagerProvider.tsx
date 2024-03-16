import { createContext, useState, useEffect, ReactNode } from "react";
import { Filter, Note } from "../Shared/Types";

export interface NoteManagerContextProps {
  notes: Note[];
  editingNote: Note | null;
  saveNote: (note: Note) => void;
  deleteNote: (note: Note) => void;
  setEditingNote: (note: Note | null) => void;
  toggleNotePin: (note: Note) => void;
  toggleNoteArchive: (note: Note) => void;

  labels: string[];
  saveLabel: (label: string) => void;

  filters: Filter[];
  setFilters: (filters: Filter[]) => void;
}

export interface NoteManagerProviderProps {
  children: ReactNode;
}

export const NoteManagerContext = createContext<NoteManagerContextProps | null>(
  null
);

const NoteManagerProvider = ({ children }: NoteManagerProviderProps) => {
  const parseJsonFromLs = <T extends unknown>(key: string): T[] => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  };

  const setJsonToLs = <T extends unknown>(key: string, values: T[]) => {
    localStorage.setItem(key, JSON.stringify(values));
  };

  const [notes, setNotes] = useState<Note[]>(() =>
    parseJsonFromLs<Note>("notes")
  );

  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const saveNote = (note: Note) => {
    const updatedNotes = note.id
      ? notes.map((prevNote) => (prevNote.id === note.id ? note : prevNote)) //update
      : [...notes, { ...note, id: `note-${notes.length + 1}` }]; //create
    setNotes(updatedNotes);
  };

  const toggleNoteArchive = (note: Note) => {
    saveNote({ ...note, isArchived: !note.isArchived });
  };

  const toggleNotePin = (note: Note) => {
    saveNote({ ...note, isPinned: !note.isPinned });
  };

  const deleteNote = (note: Note) => {
    setNotes(notes.filter((n) => n.id !== note.id));
  };

  const [labels, setLabels] = useState<string[]>(() =>
    parseJsonFromLs<string>("labels")
  );

  const saveLabel = (label: string) => {
    if (!label) {
      return;
    }

    setLabels((prevLabels) => [...prevLabels, label]);
  };

  const [filters, setFilters] = useState<Filter[]>(() =>
    parseJsonFromLs<Filter>("filters")
  );

  const prepareFilters = () => {
    const availableFilters: Filter[] = [
      {
        key: "isArchived",
        label: "Archived",
        valueType: "boolean",
        selected: false,
      },
      {
        key: "labels",
        label: "Labels",
        valueType: "array",
        options: labels,
        selected: [],
      },
    ];
    let savedFilters = parseJsonFromLs<Filter>("filters");
    if (savedFilters) {
      availableFilters.forEach((availableFilter) => {
        const savedFilter = savedFilters.find(
          (savedFilter) => savedFilter.key === availableFilter.key
        );
        if (savedFilter) {
          savedFilter.options = availableFilter.options;
        } else {
          savedFilters.push(availableFilter);
        }
      });
    } else {
      savedFilters = availableFilters;
    }
    setFilters(savedFilters);
  };

  useEffect(() => {
    prepareFilters();
  }, []);

  useEffect(() => {
    setJsonToLs("filters", filters);
  }, [filters]);

  useEffect(() => {
    setJsonToLs("notes", notes);
  }, [notes]);

  useEffect(() => {
    setJsonToLs("labels", labels);
    prepareFilters();
  }, [labels]);

  const contextValue: NoteManagerContextProps = {
    notes,
    editingNote,
    saveNote,
    deleteNote,
    setEditingNote,
    toggleNotePin,
    toggleNoteArchive,
    labels,
    saveLabel,
    filters,
    setFilters,
  };

  return (
    <NoteManagerContext.Provider value={contextValue}>
      {children}
    </NoteManagerContext.Provider>
  );
};

export default NoteManagerProvider;
