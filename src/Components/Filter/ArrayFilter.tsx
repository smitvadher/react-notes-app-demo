import { FilterComponentProps } from "../../Shared/Types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

const ArrayFilter = ({ filter, onToggleFilter }: FilterComponentProps) => {
  const toggleFilter = (value: string) => {
    if (!Array.isArray(filter.selected)) {
      return;
    }
    const selectedValues = filter.selected.includes(value)
      ? filter.selected.filter((prevSelected) => prevSelected !== value)
      : [...filter.selected, value];

    onToggleFilter({ ...filter, selected: selectedValues });
  };

  return (
    filter.options &&
    filter.options.length > 0 &&
    filter.options.map((option) => {
      let selected =
        Array.isArray(filter.selected) && filter.selected.includes(option);
      return (
        <li
          key={option}
          className={`capsule ${selected ? "active" : ""}`}
          title={selected ? `Filterd by ${option}` : ""}
          onClick={() => toggleFilter(option)}
        >
          {option}
          {selected && (
            <FontAwesomeIcon
              className="action-btn icon active"
              icon={faCheck}
              onClick={() => toggleFilter(option)}
            />
          )}
        </li>
      );
    })
  );
};

export default ArrayFilter;
