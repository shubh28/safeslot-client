export const loadState = key => {
  try {
    const localData = localStorage.getItem(key);
    if (localData !== null) {
      return JSON.parse(localData);
    }
  } catch (err) {
    console.error("There was an issue reading to local storage");
  }
};

export const saveState = (key, value) => {
  try {
    const localData = JSON.stringify(value);
    localStorage.setItem(key, localData);
  } catch (err) {
    console.error("There was an issue saving to local storage");
  }
};

export const loadUserAuthenticationDetails = () => {
  return loadState('userAuthenticationDetails');
}
