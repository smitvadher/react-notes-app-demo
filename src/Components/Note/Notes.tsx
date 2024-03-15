import Note from "./Note";
import {
  NoteManagerContext,
  NoteManagerContextProps,
} from "../../Context/NoteManagerProvider";
import { useContext, useEffect, useState } from "react";
import NotePopup from "./NotePopup";

const Notes = () => {
  const [addNotePopup, setAddNotePopup] = useState(false);

  const { notes } = useContext(NoteManagerContext) as NoteManagerContextProps;

  const pinnedNotes = notes.filter((note) => note.isPinned);
  const otherNotes = notes.filter((note) => !note.isPinned);

  return (
    <>
      <div className="button mb-3" onClick={() => setAddNotePopup(true)}>
        Add note
      </div>
      {/* <div className="filters">
        <ul>
          <li>Archived</li>
          {labels.map((label) => (
            <li key={label}>{label}</li>
          ))}
        </ul>
      </div> */}
      {addNotePopup && (
        <NotePopup
          open={addNotePopup}
          onClose={() => setAddNotePopup(false)}
        ></NotePopup>
      )}
      {notes.length === 0 ? (
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
