import { useContext, useEffect, useRef, useState } from "react";
import { NotesContext, NotesContextProps } from "../../Context/NotesContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

interface LabelsPopupProps {
  open: boolean;
  onClose: () => void;
}

const LabelsPopup = ({ open, onClose }: LabelsPopupProps) => {
  const { labels, saveLabel, deleteLabel } = useContext(
    NotesContext
  ) as NotesContextProps;

  const [inputValue, setInputValue] = useState("");
  const [filteredLabels, setFilteredLabels] = useState<string[]>(labels);

  const labelsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const filtered = labels.filter((label) =>
      label.toLowerCase().includes(inputValue.toLowerCase().trim())
    );
    setFilteredLabels(filtered);
  }, [inputValue, labels]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInputValue = e.target.value;
    if (newInputValue.length <= 15) {
      setInputValue(newInputValue);
    }
  };

  const handleCreateLabel = () => {
    if (inputValue.trim() !== "") {
      saveLabel(inputValue.trim());
      setInputValue("");
    }
  };

  const deleteLabelClick = (label: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete the "${label}" label?\nDeleting the label will also remove it from related notes.`
      )
    ) {
      deleteLabel(label);
    }
  };

  return (
    <>
      {open && (
        <>
          <div className="overlay" onClick={onClose}></div>
          <div className="labels-popup" ref={labelsRef}>
            <h6>Labels</h6>
            <input
              className="label-input"
              placeholder="Enter lable name"
              type="text"
              value={inputValue}
              onChange={handleInputChange}
            ></input>
            <ul>
              {filteredLabels.map((label) => (
                <li key={label}>
                  <div>
                    {label}
                    <FontAwesomeIcon
                      className="delete icon"
                      icon={faTrash}
                      onClick={() => deleteLabelClick(label)}
                      title={`Delete ${label}`}
                    />
                  </div>
                </li>
              ))}
              {inputValue.trim() !== "" && filteredLabels.length === 0 && (
                <button
                  className="button button-sm"
                  onClick={handleCreateLabel}
                >
                  Create "{inputValue}"
                </button>
              )}
            </ul>
          </div>
        </>
      )}
    </>
  );
};

export default LabelsPopup;
