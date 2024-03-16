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

  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const [notes, setNotes] = useState<Note[]>(() =>
    parseJsonFromLs<Note>("notes")
  );

  const [labels, setLabels] = useState<string[]>(() =>
    parseJsonFromLs<string>("labels")
  );

  const [filters, setFilters] = useState<Filter[]>(() =>
    parseJsonFromLs<Filter>("filters")
  );

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

  const saveNote = (note: Note) => {
    setNotes((prevNotes) => {
      if (note.id) {
        return prevNotes.map((prevNote) =>
          prevNote.id === note.id ? note : prevNote
        );
      } else {
        const lastNote = prevNotes?.[prevNotes.length - 1];
        const lastNoteId = lastNote?.id
          ? parseInt(lastNote.id.split("-")[1])
          : 0;
        note.id = `note-${lastNoteId + 1}`;
        return [...prevNotes, note];
      }
    });
  };

  const toggleNoteState = (note: Note, key: keyof Note) => {
    saveNote({ ...note, [key]: !note[key] });
  };

  const toggleNotePin = (note: Note) => {
    toggleNoteState(note, "isPinned");
  };

  const toggleNoteArchive = (note: Note) => {
    toggleNoteState(note, "isArchived");
  };

  const deleteNote = (note: Note) => {
    setNotes(notes.filter((n) => n.id !== note.id));
  };

  const saveLabel = (label: string) => {
    if (!label || labels.includes(label)) {
      return;
    }
    setLabels((prevLabels) => [...prevLabels, label]);
  };

  const prepareFilters = () => {
    const availableFilters: Filter[] = [
      {
        key: "isArchived",
        label: "Archived",
        valueType: "boolean",
        selected: false,
        default: false,
      },
      {
        key: "labels",
        label: "Labels",
        valueType: "array",
        options: labels,
        selected: [],
        default: [],
      },
    ];
    let savedFilters = parseJsonFromLs<Filter>("filters");

    availableFilters.forEach((availableFilter) => {
      const savedFilterIndex = savedFilters.findIndex(
        (savedFilter) => savedFilter.key === availableFilter.key
      );
      if (savedFilterIndex !== -1) {
        savedFilters[savedFilterIndex] = {
          ...savedFilters[savedFilterIndex],
          ...availableFilter, //apply available fields
          selected: savedFilters[savedFilterIndex].selected, //keep previous selected option
        };
      } else {
        savedFilters.push(availableFilter);
      }
    });

    setFilters(savedFilters);
  };

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
