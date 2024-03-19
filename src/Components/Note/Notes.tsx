import Note from "./Note";
import { Note as NoteObj } from "../../Shared/Types";
import { useState } from "react";
import NotePopup from "./NotePopup";
import Filters from "../Filter/Filters";
import LabelsPopup from "../Label/LabelsPopup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPen } from "@fortawesome/free-solid-svg-icons";

const Notes = () => {
  const [addNotePopup, setAddNotePopup] = useState(false);
  const [addLabelsPopup, setAddLabelsPopup] = useState(false);
  const [pinnedNotes, setPinnedNotes] = useState<NoteObj[]>([]);
  const [otherNotes, setOtherNotes] = useState<NoteObj[]>([]);

  const handleFilteredNotes = (notes: NoteObj[]) => {
    setPinnedNotes(notes.filter((note) => note.isPinned));
    setOtherNotes(notes.filter((note) => !note.isPinned));
  };

  return (
    <>
      <div
        className="button button-sm my-3"
        onClick={() => setAddNotePopup(true)}
      >
        <FontAwesomeIcon className="mx-1" icon={faPlus} />
        Add note
      </div>
      <div
        className="button button-sm my-3 mx-2"
        onClick={() => setAddLabelsPopup(true)}
      >
        <FontAwesomeIcon className="mx-1" icon={faPen} />
        Manage labels
      </div>
      <Filters filteredNotes={handleFilteredNotes}></Filters>
      {addNotePopup && (
        <NotePopup
          open={addNotePopup}
          onClose={() => setAddNotePopup(false)}
        ></NotePopup>
      )}
      {addLabelsPopup && (
        <LabelsPopup
          open={addLabelsPopup}
          onClose={() => setAddLabelsPopup(false)}
        ></LabelsPopup>
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
