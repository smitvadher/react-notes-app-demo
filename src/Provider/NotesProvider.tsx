import { useState, useEffect, ReactNode } from "react";
import { Filter, Note } from "../Shared/Types";
import {
  parseJsonFromLocalStorage,
  setJsonToLocalStorage,
} from "../Shared/Utilities/LocalStorageUtils";
import { Backgrounds, StorageKeys } from "../Constants/Strings";
import { NotesContext, NotesContextProps } from "../Context/NotesContext";
import { mergeFilters } from "../Shared/Utilities/FiltersUtils";
import BackgroundFilter from "../Components/Filter/BackgroundFilter";

export interface NotesProviderProps {
  children: ReactNode;
}

const NotesProvider = ({ children }: NotesProviderProps) => {
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const [notes, setNotes] = useState<Note[]>(() =>
    parseJsonFromLocalStorage<Note>(StorageKeys.Notes)
  );

  const [labels, setLabels] = useState<string[]>(() =>
    parseJsonFromLocalStorage<string>(StorageKeys.Labels)
  );

  const [filters, setFilters] = useState<Filter[]>(() =>
    parseJsonFromLocalStorage<Filter>(StorageKeys.Filters)
  );

  useEffect(() => {
    setJsonToLocalStorage(StorageKeys.Notes, notes);
  }, [notes]);

  useEffect(() => {
    setJsonToLocalStorage(StorageKeys.Labels, labels);
    prepareFilters();
  }, [labels]);

  useEffect(() => {
    prepareFilters();
  }, []);

  useEffect(() => {
    setJsonToLocalStorage(StorageKeys.Filters, filters);
  }, [filters]);

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
      {
        key: "color",
        label: "Color",
        valueType: "string",
        options: Backgrounds,
        selected: [],
        default: [],
        component: BackgroundFilter,
      },
      {
        key: "title",
        label: "Title",
        valueType: "string",
        selected: "",
        default: "",
      },
    ];
    let savedFilters = parseJsonFromLocalStorage<Filter>(StorageKeys.Filters);

    setFilters(mergeFilters(availableFilters, savedFilters));
  };

  const contextValue: NotesContextProps = {
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
    <NotesContext.Provider value={contextValue}>
      {children}
    </NotesContext.Provider>
  );
};

export default NotesProvider;
