import Note from "./Note";
import { Note as NoteObj } from "../../Shared/Types";
import { useState } from "react";
import NotePopup from "./NotePopup";
import Filters from "../Filter/Filters";

const Notes = () => {
  const [addNotePopup, setAddNotePopup] = useState(false);
  const [pinnedNotes, setPinnedNotes] = useState<NoteObj[]>([]);
  const [otherNotes, setOtherNotes] = useState<NoteObj[]>([]);

  const handleFilteredNotes = (notes: NoteObj[]) => {
    setPinnedNotes(notes.filter((note) => note.isPinned));
    setOtherNotes(notes.filter((note) => !note.isPinned));
  };

  return (
    <>
      <div className="button mb-3" onClick={() => setAddNotePopup(true)}>
        Add note
      </div>
      <Filters filteredNotes={handleFilteredNotes}></Filters>
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
