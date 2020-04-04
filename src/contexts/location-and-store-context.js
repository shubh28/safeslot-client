import React, { useState, createContext, useContext } from 'react';
import { DEFAULT_LOCATION } from '../common/consts';

const LocationAndStoreContext = createContext();

function LocationAndStoreProvider({ children }) {
  const defaultStoreSlotId = { storeId: undefined, slotId: undefined };
  const [locationAndStore, setLocationAndStore] = useState({
    location: DEFAULT_LOCATION,
    storeSlotId: defaultStoreSlotId
  });

  function setLocation(location) {
    setLocationAndStore({ ...locationAndStore, location });
  }
  function setStoreSlotId(storeSlotId) {
    setLocationAndStore({ ...locationAndStore, storeSlotId });
  }

  function resetLocation() {
    setLocation(DEFAULT_LOCATION);
  }
  function resetStoreSlotId() {
    setStoreSlotId(defaultStoreSlotId);
  }

  return (
    <LocationAndStoreContext.Provider
      value={{
        location: locationAndStore.location,
        storeSlotId: locationAndStore.storeSlotId,
        setLocation,
        setStoreSlotId,
        resetLocation,
        resetStoreSlotId
      }}
    >
      {children}
    </LocationAndStoreContext.Provider>
  );
}

function useLocationAndStoreContext() {
  const context = useContext(LocationAndStoreContext);
  if (!context) {
    throw new Error(
      `useLocationAndStoreContext must be use inside LocationAndStoreProvider`
    );
  }
  return context;
}

export { LocationAndStoreProvider, useLocationAndStoreContext };
