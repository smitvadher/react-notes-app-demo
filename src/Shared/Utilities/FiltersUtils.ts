import { Filter } from "../Types";

export const mergeFilters = (
  availableFilters: Filter[],
  savedFilters: Filter[]
) => {
  availableFilters.forEach((availableFilter) => {
    const savedFilterIndex = savedFilters.findIndex(
      (savedFilter) => savedFilter.key === availableFilter.key
    );
    if (savedFilterIndex !== -1) {
      savedFilters[savedFilterIndex] = {
        ...savedFilters[savedFilterIndex],
        ...availableFilter, //apply available fields
        selected: savedFilters[savedFilterIndex].selected, //keep previous selected option
      };
    } else {
      savedFilters.push(availableFilter);
    }
  });
  return savedFilters;
};
