import { useContext, useEffect, useRef, useState } from "react";
import {
  NoteManagerContext,
  NoteManagerContextProps,
} from "../../Context/NoteManagerProvider";

interface LabelsProps {
  selectedLabels: string[];
  onSelect: (selected: string[]) => void;
  onClose: () => void;
}

const Labels = ({ selectedLabels, onSelect, onClose }: LabelsProps) => {
  const { labels, saveLabel } = useContext(
    NoteManagerContext
  ) as NoteManagerContextProps;

  const [inputValue, setInputValue] = useState("");
  const [selected, setSelected] = useState<string[]>(selectedLabels);
  const [filteredLabels, setFilteredLabels] = useState<string[]>(labels);

  const labelsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (labelsRef.current && !labelsRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 10);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

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

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setSelected((prevSelected) =>
      checked
        ? [...prevSelected, value]
        : prevSelected.filter((v) => v !== value)
    );
  };

  const handleCreateLabel = () => {
    if (inputValue.trim() !== "") {
      saveLabel(inputValue.trim());
      setInputValue("");
      onSelect(selected);
    }
  };

  useEffect(() => {
    onSelect(selected);
  }, [selected]);

  return (
    <div className="labels-selector" ref={labelsRef}>
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
              <label htmlFor={`checkbox-${label}`}>
                <input
                  type="checkbox"
                  id={`checkbox-${label}`}
                  onChange={handleCheckboxChange}
                  value={label}
                  checked={selected.includes(label)}
                ></input>
                {label}
              </label>
            </div>
          </li>
        ))}
        {inputValue.trim() !== "" && filteredLabels.length === 0 && (
          <button className="button button-sm" onClick={handleCreateLabel}>
            Create "{inputValue}"
          </button>
        )}
      </ul>
    </div>
  );
};

export default Labels;
