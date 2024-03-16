import { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import {
  NoteManagerContext,
  NoteManagerContextProps,
} from "../../Context/NoteManagerProvider";
import { Filter as FilterObj } from "../../Shared/Types";

const Filters = () => {
  const { filters, setFilters } = useContext(
    NoteManagerContext
  ) as NoteManagerContextProps;

  const toggleFilter = (filter: FilterObj) => {
    setFilters(
      filters.map((prevFilter) => {
        if (prevFilter.key === filter.key) {
          return filter;
        }
        return prevFilter;
      })
    );
  };

  const toggleBooleanFilter = (filter: FilterObj) => {
    filter.selected = !(filter.selected as boolean);
    toggleFilter(filter);
  };

  const toggleArrayFilter = (filter: FilterObj, value: string) => {
    if (!Array.isArray(filter.selected)) {
      return;
    }
    if (filter.selected.includes(value)) {
      filter.selected = filter.selected.filter(
        (prevSelected) => prevSelected !== value
      );
    } else {
      filter.selected = [...filter.selected, value];
    }

    toggleFilter(filter);
  };

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
      </ul>
    </div>
  );
};

export default Filters;
