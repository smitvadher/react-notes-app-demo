import { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import {
  NoteManagerContext,
  NoteManagerContextProps,
} from "../../Context/NoteManagerProvider";
import { Filter as FilterObj, Note as NoteObj } from "../../Shared/Types";

interface LabelsProps {
  filteredNotes: (notes: NoteObj[]) => void;
}

const Filters = ({ filteredNotes }: LabelsProps) => {
  const { notes, filters, setFilters } = useContext(
    NoteManagerContext
  ) as NoteManagerContextProps;

  const [removeOption, setRemoveOption] = useState(false);

  const toggleFilter = (filter: FilterObj) => {
    setFilters(
      filters.map((prevFilter) =>
        prevFilter.key === filter.key ? filter : prevFilter
      )
    );
  };

  const toggleBooleanFilter = (filter: FilterObj) => {
    toggleFilter({ ...filter, selected: !(filter.selected as boolean) });
  };

  const toggleArrayFilter = (filter: FilterObj, value: string) => {
    if (!Array.isArray(filter.selected)) {
      return;
    }

    const selectedValues = filter.selected.includes(value)
      ? filter.selected.filter((prevSelected) => prevSelected !== value)
      : [...filter.selected, value];

    toggleFilter({ ...filter, selected: selectedValues });
  };

  const handleOnFilterChange = () => {
    return notes.filter((note) => {
      return filters.every((filter) => {
        if (filter.valueType === "boolean") {
          return note[filter.key] == filter.selected;
        } else if (
          filter.valueType === "array" &&
          Array.isArray(filter.selected)
        ) {
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
          (Array.isArray(filter.selected) && filter.selected.length > 0)
      )
    );
  }, [filters]);

  return (
    <div className="filters">
      <ul className="capsules">
        {filters.map((filter) => {
          if (filter.valueType === "boolean") {
            let selected = filter.selected;
            return (
              <li
                key={filter.key}
                className={`capsule ${selected ? "active" : ""}`}
                title={selected ? `Filterd by ${filter.label}` : ""}
                onClick={() => toggleBooleanFilter(filter)}
              >
                {filter.label}
                {selected && (
                  <FontAwesomeIcon
                    className="action-btn icon active"
                    icon={faCheck}
                    onClick={() => toggleBooleanFilter(filter)}
                  />
                )}
              </li>
            );
          } else if (filter.valueType === "array" && filter.options?.length) {
            return filter.options.map((option) => {
              let selected =
                Array.isArray(filter.selected) &&
                filter.selected.includes(option);
              return (
                <li
                  key={option}
                  className={`capsule ${selected ? "active" : ""}`}
                  title={selected ? `Filterd by ${option}` : ""}
                  onClick={() => toggleArrayFilter(filter, option)}
                >
                  {option}
                  {selected && (
                    <FontAwesomeIcon
                      className="action-btn icon active"
                      icon={faCheck}
                      onClick={() => toggleArrayFilter(filter, option)}
                    />
                  )}
                </li>
              );
            });
          }
          return null;
        })}
        {removeOption && (
          <li
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
