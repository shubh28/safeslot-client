export const loadState = (key) => {
  try {
    const localData = localStorage.getItem(key);
    if (localData === null) {
      return;
    }
    return JSON.parse(localData);
  } catch (err) {
    return;
  }
};

export const saveState = (key, value) => {
  try {
    const localData = JSON.stringify(value);
    localStorage.setItem(key, localData);
  } catch (err) {
  }
};
