import { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { NotesContext, NotesContextProps } from "../../Context/NotesContext";
import {
  FilterComponentProps,
  Filter as FilterObj,
  Note as NoteObj,
} from "../../Shared/Types";
import BooleanFilter from "./BooleanFilter";
import ArrayFilter from "./ArrayFilter";
import StringFilter from "./StringFilter";

interface LabelsProps {
  filteredNotes: (notes: NoteObj[]) => void;
}

const Filters = ({ filteredNotes }: LabelsProps) => {
  const { notes, filters, setFilters } = useContext(
    NotesContext
  ) as NotesContextProps;

  const [removeOption, setRemoveOption] = useState(false);

  const toggleFilter = (updatedFilter: FilterObj) => {
    setFilters(
      filters.map((prevFilter) =>
        prevFilter.key === updatedFilter.key ? updatedFilter : prevFilter
      )
    );
  };

  const handleOnFilterChange = () => {
    return notes.filter((note) => {
      return filters.every((filter) => {
        if (filter.valueType === "boolean") {
          return note[filter.key] == filter.selected;
        } else if (filter.valueType === "string") {
          if (Array.isArray(filter.selected)) {
            return (
              filter.selected.length === 0 ||
              filter.selected.some((selected) => note[filter.key] == selected)
            );
          } else {
            return (
              !filter.selected ||
              (note[filter.key] as string).indexOf(filter.selected as string) >
                -1
            );
          }
        } else if (Array.isArray(filter.selected)) {
          return (
            filter.selected.length === 0 ||
            filter.selected.some((selected) =>
              (note[filter.key] as string[]).includes(selected)
            )
          );
        }
        return true;
      });
    });
  };

  const resetFilters = () => {
    setFilters(
      filters.map((filter) => ({ ...filter, selected: filter.default }))
    );
  };

  useEffect(() => {
    filteredNotes(handleOnFilterChange());
  }, [notes, filters]);

  useEffect(() => {
    setRemoveOption(
      filters.some(
        (filter) =>
          filter.selected === true ||
          (filter.selected as string).length > 0 ||
          (Array.isArray(filter.selected) && filter.selected.length > 0)
      )
    );
  }, [filters]);

  const renderFunctionMap: { [key: string]: React.FC<FilterComponentProps> } = {
    boolean: BooleanFilter,
    array: ArrayFilter,
    string: StringFilter,
  };

  return (
    <div className="filters">
      <ul className="capsules">
        {filters.map((filter) => {
          if (filter.component) {
            return (
              <filter.component
                key={filter.key}
                filter={filter}
                onToggleFilter={toggleFilter}
              />
            );
          } else {
            const FilterComponent = renderFunctionMap[filter.valueType];
            return (
              <FilterComponent
                key={filter.key}
                filter={filter}
                onToggleFilter={toggleFilter}
              />
            );
          }
        })}
        {removeOption && (
          <li
            key={"remove-filters"}
            className="capsule reset active"
            title="Reset filters"
            onClick={resetFilters}
          >
            Reset filters
            <FontAwesomeIcon
              className="action-btn icon active"
              icon={faTimes}
              onClick={resetFilters}
            />
          </li>
        )}
      </ul>
    </div>
  );
};

export default Filters;
