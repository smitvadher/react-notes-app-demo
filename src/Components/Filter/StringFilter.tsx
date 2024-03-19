import { FilterComponentProps } from "../../Shared/Types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { ChangeEvent } from "react";

const StringFilter = ({ filter, onToggleFilter }: FilterComponentProps) => {
  const toggleFilter = (e: ChangeEvent<HTMLInputElement>) => {
    onToggleFilter({ ...filter, selected: e.target.value });
  };

  let selected = filter.selected as string;
  return (
    <li
      key={filter.key}
      className={`capsule ${selected ? "active" : ""}`}
      title={selected ? `Filterd by ${selected}` : ""}
    >
      <input
        type="text"
        onChange={toggleFilter}
        placeholder={`Search by ${filter.label}`}
        value={filter.selected as string}
      ></input>
      {selected && (
        <FontAwesomeIcon className="action-btn icon active" icon={faCheck} />
      )}
    </li>
  );
};

export default StringFilter;
