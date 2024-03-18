export const parseJsonFromLocalStorage = <T extends unknown>(
  key: string
): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

export const setJsonToLocalStorage = <T extends unknown>(
  key: string,
  values: T[]
) => {
  localStorage.setItem(key, JSON.stringify(values));
};
