import { FilterComponentProps } from "../../Shared/Types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

const BooleanFilter = ({ filter, onToggleFilter }: FilterComponentProps) => {
  const toggleFilter = () => {
    onToggleFilter({ ...filter, selected: !(filter.selected as boolean) });
  };

  const selected = filter.selected as boolean;
  return (
    <li
      key={filter.key}
      className={`capsule ${selected ? "active" : ""}`}
      title={selected ? `Filterd by ${filter.label}` : ""}
      onClick={toggleFilter}
    >
      {filter.label}
      {selected && (
        <FontAwesomeIcon
          className="action-btn icon active"
          icon={faCheck}
          onClick={toggleFilter}
        />
      )}
    </li>
  );
};

export default BooleanFilter;
