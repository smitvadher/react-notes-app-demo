import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

interface FiltersProp {
  labels: string[];
  onFilterChange: (showArchived: boolean, selectedLabels: string[]) => void;
}

const Filters = ({ labels, onFilterChange }: FiltersProp) => {
  const [filteredLables, setFilteredLables] = useState<string[]>([]);
  const [showArchived, setShowArchived] = useState(false);

  const toggleLabelFilter = (label: string) => {
    if (filteredLables.includes(label)) {
      setFilteredLables(
        filteredLables.filter((selectedLabel) => selectedLabel !== label)
      );
    } else {
      setFilteredLables([...filteredLables, label]);
    }
  };

  const toggleArchivedFilter = () => {
    setShowArchived(!showArchived);
  };

  useEffect(() => {
    onFilterChange(showArchived, filteredLables);
  }, [showArchived, filteredLables]);

  return (
    <div className="filters">
      <ul className="capsules">
        <li
          className={`capsule ${showArchived ? "active" : ""}`}
          title={showArchived ? "Filterd by Archived" : ""}
          onClick={toggleArchivedFilter}
        >
          Archived
          {showArchived && (
            <FontAwesomeIcon
              className="action-btn icon active"
              icon={faCheck}
              onClick={toggleArchivedFilter}
            />
          )}
        </li>
        {labels.map((label) => (
          <li
            key={label}
            className={`capsule ${
              filteredLables.includes(label) ? "active" : ""
            }`}
            title={filteredLables.includes(label) ? `Filtered by ${label}` : ""}
            onClick={() => toggleLabelFilter(label)}
          >
            {label}
            {filteredLables.includes(label) && (
              <FontAwesomeIcon
                className="action-btn icon active"
                icon={faCheck}
                onClick={() => toggleLabelFilter(label)}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Filters;
