import { useContext, useState } from "react";
import { Note as NoteObj } from "../../Shared/Types";
import { NotesContext, NotesContextProps } from "../../Context/NotesContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbTack,
  faArchive,
  faTags,
  faTimes,
  faTrash,
  faPalette,
} from "@fortawesome/free-solid-svg-icons";
import Labels from "../Label/Labels";
import Background from "./Background";

interface NoteProp {
  note: NoteObj;
}

const Note = ({ note }: NoteProp) => {
  const {
    saveNote,
    deleteNote,
    setEditingNote,
    toggleNotePin,
    toggleNoteArchive,
  } = useContext(NotesContext) as NotesContextProps;

  const [manageLabels, setManageLabels] = useState(false);
  const [manageBackground, setManageBackground] = useState(false);
  const [isMouseOver, setIsMouseOver] = useState(false);

  const closeLabels = () => setManageLabels(false);

  const handleLabelSelect = (selectedLabels: string[]) => {
    saveNote({ ...note, labels: selectedLabels });
  };

  const closeBackground = () => setManageBackground(false);

  const handleBackgroundSelect = (selectedBackground: string) => {
    saveNote({ ...note, color: selectedBackground });
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

  const active = isMouseOver || manageLabels || manageBackground;
  return (
    <div
      className={`note n-clickable ${active ? "active" : ""}`}
      onMouseEnter={() => setIsMouseOver(true)}
      onMouseLeave={() => setIsMouseOver(false)}
      style={{ backgroundColor: note.color }}
    >
      <div className="n-clickable" onClick={handleContainerClick}>
        <FontAwesomeIcon
          className="pin icon"
          icon={faThumbTack}
          onClick={() => toggleNotePin(note)}
          title={note.isPinned ? "Unpin" : "Pin"}
        />
        <div className="title n-clickable">{note.title}</div>
        <div className="content n-clickable">{note.content}</div>
        {note.labels?.length > 0 && (
          <ul className="capsules">
            {note.labels.map((label) => (
              <li className="capsule" key={label}>
                {label}
                <FontAwesomeIcon
                  className="action-btn icon"
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
        <FontAwesomeIcon
          className="colors icon"
          icon={faPalette}
          onClick={() => setManageBackground(true)}
          title="Color note"
        />
        <FontAwesomeIcon
          className="delete icon"
          icon={faTrash}
          onClick={() => deleteNote(note)}
          title="Delete note"
        />
        {manageBackground && (
          <Background
            onSelect={handleBackgroundSelect}
            selected={note.color}
            onClose={closeBackground}
          ></Background>
        )}
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
