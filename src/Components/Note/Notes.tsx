import Note from "./Note";
import { Note as NoteObj } from "../../Shared/Types";
import {
  NoteManagerContext,
  NoteManagerContextProps,
} from "../../Context/NoteManagerProvider";
import { useContext, useEffect, useState } from "react";
import NotePopup from "./NotePopup";
import Filters from "../Filter/Filters";

const Notes = () => {
  const [addNotePopup, setAddNotePopup] = useState(false);
  const [pinnedNotes, setPinnedNotes] = useState<NoteObj[]>([]);
  const [otherNotes, setOtherNotes] = useState<NoteObj[]>([]);

  const { notes, filters } = useContext(
    NoteManagerContext
  ) as NoteManagerContextProps;

  const handleOnFilterChange = () => {
    let filteredNotes = notes;
    filters.forEach((filter) => {
      if (filter.valueType === "boolean") {
        filteredNotes = filteredNotes.filter(
          (note) => note[filter.key] == filter.selected
        );
      } else if (
        filter.valueType === "array" &&
        Array.isArray(filter.selected)
      ) {
        if (filter.selected.length > 0) {
          filteredNotes = filteredNotes.filter((note) =>
            (filter.selected as string[]).some((selected) =>
              (note[filter.key] as string[]).includes(selected)
            )
          );
        }
      }
    });
    setPinnedNotes(filteredNotes.filter((note) => note.isPinned));
    setOtherNotes(filteredNotes.filter((note) => !note.isPinned));
  };

  useEffect(() => {
    handleOnFilterChange();
  }, [notes, filters]);

  return (
    <>
      <div className="button mb-3" onClick={() => setAddNotePopup(true)}>
        Add note
      </div>
      <Filters></Filters>
      {addNotePopup && (
        <NotePopup
          open={addNotePopup}
          onClose={() => setAddNotePopup(false)}
        ></NotePopup>
      )}
      {pinnedNotes.length + otherNotes.length === 0 ? (
        <div>No notes yet</div>
      ) : (
        <div>
          {pinnedNotes.length > 0 && (
            <div className="section">
              <h4>Pinned</h4>
              <div className="notes">
                {pinnedNotes.map((note) => (
                  <Note key={note.id} note={note}></Note>
                ))}
              </div>
            </div>
          )}
          {otherNotes.length > 0 && (
            <div className="section">
              <h4>Others</h4>
              <div className="notes">
                {otherNotes.map((note) => (
                  <Note key={note.id} note={note}></Note>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Notes;
