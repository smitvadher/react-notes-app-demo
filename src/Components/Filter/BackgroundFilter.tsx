import { Background, FilterComponentProps } from "../../Shared/Types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

const BackgroundFilter = ({ filter, onToggleFilter }: FilterComponentProps) => {
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
    filter.options?.length && (
      <ul className="background-filters">
        {filter.options.map((option: Background) => {
          let selected =
            Array.isArray(filter.selected) &&
            filter.selected.includes(option.value);
          return (
            <li
              key={`${option.name}-${option.value}`}
              className={`capsule ${selected ? "active" : ""}`}
              title={selected ? `Filterd by ${option.name}` : ""}
              onClick={() => toggleFilter(option.value)}
              style={{ backgroundColor: option.value }}
            >
              {option.name}
              {selected && (
                <FontAwesomeIcon
                  className="action-btn icon active"
                  icon={faCheck}
                  onClick={() => toggleFilter(option.value)}
                />
              )}
            </li>
          );
        })}
      </ul>
    )
  );
};

export default BackgroundFilter;
