import { ChangeEvent, useContext, useEffect, useState } from "react";
import { Note as NoteObj } from "../../Shared/Types";
import {
  NoteManagerContext,
  NoteManagerContextProps,
} from "../../Context/NoteManagerProvider";

interface NotePopupProps {
  open?: boolean;
  onClose?: () => void;
}

const NotePopup = ({ open = false, onClose }: NotePopupProps) => {
  const { editingNote, setEditingNote, saveNote } = useContext(
    NoteManagerContext
  ) as NoteManagerContextProps;

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

  const closePopup = () => {
    onClose?.();
    setEditingNote(null);
  };

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

  const handleSaveNote = () => {
    saveNote?.(note);
    closePopup();
  };

  const disableBtn = !note.title || !note.content;

  return (
    <>
      {(open || editingNote) && (
        <>
          <div className="overlay" onClick={closePopup}></div>
          <div className="popup">
            <span className="popup-close" onClick={closePopup}>
              X
            </span>
            <div className="content">
              <input
                type="text"
                placeholder="Title"
                className="title w-100"
                name="title"
                value={note.title}
                onChange={handleInputChange}
              />
              <textarea
                id="content-ta"
                placeholder="Note"
                className="content w-100 mt-2"
                name="content"
                value={note.content}
                onChange={handleInputChange}
              />
              <button
                className="button mt-2 w-100"
                disabled={disableBtn}
                onClick={handleSaveNote}
              >
                {editingNote ? "Save" : "Add"}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default NotePopup;
