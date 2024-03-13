import { useContext, useState } from "react";
import { Note as NoteObj } from "../../Shared/Types";
import {
  NoteManagerContext,
  NoteManagerContextProps,
} from "../../Context/NoteManagerProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbTack,
  faArchive,
  faTags,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import Labels from "./Labels";

interface NoteProp {
  note: NoteObj;
}

const Note = ({ note }: NoteProp) => {
  const { saveNote, setEditingNote, toggleNotePin, toggleNoteArchive } =
    useContext(NoteManagerContext) as NoteManagerContextProps;

  const [manageLabels, setManageLabels] = useState(false);
  const [isMouseOver, setIsMouseOver] = useState(false);

  const closeLabels = () => setManageLabels(false);

  const handleLabelSelect = (selectedLabels: string[]) => {
    saveNote({ ...note, labels: selectedLabels });
  };

  const handleLabelRemoveIconClick = (label: string) => {
    saveNote({ ...note, labels: note.labels.filter((l) => l !== label) });
    setManageLabels(false);
  };

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const clickedElement = e.target as HTMLElement;
    if (
      clickedElement.className?.includes &&
      clickedElement.className?.includes("n-clickable")
    ) {
      setEditingNote(note);
      return;
    }
    e.stopPropagation();
  };

  return (
    <div
      className={`note n-clickable ${
        isMouseOver || manageLabels ? "active" : ""
      }`}
      onMouseEnter={() => setIsMouseOver(true)}
      onMouseLeave={() => setIsMouseOver(false)}
    >
      <div className="note-section" onClick={handleContainerClick}>
        <FontAwesomeIcon
          className="pin icon"
          icon={faThumbTack}
          onClick={() => toggleNotePin(note)}
          title={note.isPinned ? "Unpin" : "Pin"}
        />
        <div className="title n-clickable">{note.title}</div>
        <div className="content n-clickable">{note.content}</div>
        {note.labels?.length > 0 && (
          <ul className="note-labels">
            {note.labels.map((label) => (
              <li key={label}>
                {label}
                <FontAwesomeIcon
                  className="remove-label icon"
                  icon={faTimes}
                  onClick={() => handleLabelRemoveIconClick(label)}
                  title="Remove label"
                />
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="botton-icons">
        <FontAwesomeIcon
          className="archive icon"
          icon={faArchive}
          onClick={() => toggleNoteArchive(note)}
          title={note.isArchived ? "Unarchive" : "Archive"}
        />
        <FontAwesomeIcon
          className="labels icon"
          icon={faTags}
          onClick={() => setManageLabels(true)}
          title="Label note"
        />
        {manageLabels && (
          <Labels
            onSelect={handleLabelSelect}
            selectedLabels={note.labels}
            onClose={closeLabels}
          />
        )}
      </div>
    </div>
  );
};

export default Note;
