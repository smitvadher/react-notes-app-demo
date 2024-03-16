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

  const { notes, labels } = useContext(
    NoteManagerContext
  ) as NoteManagerContextProps;

  const handleOnFilterChange = (
    showArchived: boolean,
    selectedLabels: string[]
  ) => {
    let filteredNotes = notes.filter(
      (note) =>
        (showArchived ? note.isArchived : !note.isArchived) &&
        (selectedLabels.length == 0 ||
          selectedLabels.some((label) => note.labels.includes(label)))
    );
    setPinnedNotes(filteredNotes.filter((note) => note.isPinned));
    setOtherNotes(filteredNotes.filter((note) => !note.isPinned));
  };

  useEffect(() => {
    handleOnFilterChange(false, []);
  }, [notes]);

  return (
    <>
      <div className="button mb-3" onClick={() => setAddNotePopup(true)}>
        Add note
      </div>
      <Filters labels={labels} onFilterChange={handleOnFilterChange}></Filters>
      {addNotePopup && (
        <NotePopup
          open={addNotePopup}
          onClose={() => setAddNotePopup(false)}
        ></NotePopup>
      )}
      {pinnedNotes.length + otherNotes.length === 0 ? (
        <div>No notes</div>
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
