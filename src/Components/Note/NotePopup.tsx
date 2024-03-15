import { ChangeEvent, useContext, useEffect, useState } from "react";
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
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Labels from "../Label/Labels";

interface NotePopupProps {
  open?: boolean;
  onClose?: () => void;
}

const NotePopup = ({ open = false, onClose }: NotePopupProps) => {
  const { editingNote, setEditingNote, saveNote, deleteNote } = useContext(
    NoteManagerContext
  ) as NoteManagerContextProps;

  const [manageLabels, setManageLabels] = useState(false);

  const emptyNote = {
    title: "",
    isChecked: false,
    isPinned: false,
    isArchived: false,
    color: "",
    content: "",
    labels: [],
  };
  const [note, setNote] = useState<NoteObj>(emptyNote);

  useEffect(() => {
    setNote(editingNote ? editingNote : emptyNote);
  }, [editingNote]);

  useEffect(autoExpandTextArea, [note.content]);

  function autoExpandTextArea() {
    const textarea = document.getElementById(
      "content-ta"
    ) as HTMLTextAreaElement | null;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;

    const maxHeight = parseInt(window.getComputedStyle(textarea).maxHeight);
    textarea.style.overflowY =
      textarea.scrollHeight > maxHeight ? "auto" : "hidden";
  }

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNote((prevNote) => ({
      ...prevNote,
      [name]: value,
    }));
    if (name === "content") autoExpandTextArea();
  };

  const toggleNotePin = (note: NoteObj) => {
    setNote({ ...note, isPinned: !note.isPinned });
  };

  const toggleNoteArchive = (note: NoteObj) => {
    setNote({ ...note, isArchived: !note.isArchived });
  };

  const handleLabelSelect = (selectedLabels: string[]) => {
    setNote({ ...note, labels: selectedLabels });
  };

  const handleLabelRemoveIconClick = (label: string) => {
    setNote({ ...note, labels: note.labels.filter((l) => l !== label) });
    setManageLabels(false);
  };

  const cleanup = () => {
    onClose?.();
    setManageLabels(false);
    setEditingNote(null);
  };

  const handleDeleteIconClick = () => {
    if (editingNote) {
      deleteNote(editingNote);
    }
    cleanup();
  };

  const handleSaveNote = () => {
    if (!disableBtn) {
      saveNote?.(note);
    }
    cleanup();
  };

  const closeLabels = () => setManageLabels(false);

  const disableBtn = !note.title || !note.content;

  return (
    <>
      {(open || editingNote) && (
        <>
          <div className="overlay" onClick={handleSaveNote}></div>
          <div className="popup">
            <FontAwesomeIcon
              className={`pin icon ${note.isPinned ? "active" : ""}`}
              icon={faThumbTack}
              onClick={() => toggleNotePin(note)}
              title={note.isPinned ? "Unpin" : "Pin"}
            />
            <div className="content">
              <input
                type="text"
                placeholder="Title"
                className="title"
                name="title"
                value={note.title}
                onChange={handleInputChange}
              />
              <textarea
                id="content-ta"
                placeholder="Note"
                className="content"
                name="content"
                value={note.content}
                onChange={handleInputChange}
              />
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
              <div className="botton-icons">
                <FontAwesomeIcon
                  className={`archive icon ${note.isArchived ? "active" : ""}`}
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
                {editingNote && (
                  <FontAwesomeIcon
                    className="delete icon"
                    icon={faTrash}
                    onClick={handleDeleteIconClick}
                    title="Delete note"
                  />
                )}
                {manageLabels && (
                  <Labels
                    onSelect={handleLabelSelect}
                    selectedLabels={note.labels}
                    onClose={closeLabels}
                  />
                )}
              </div>
              <button
                className="close button button-sm"
                disabled={disableBtn}
                onClick={handleSaveNote}
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default NotePopup;
