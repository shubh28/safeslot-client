import React, { useState, createContext, useContext } from "react";
import { DEFAULT_LOCATION } from "../consts";

const LocationAndStoreContext = createContext();

function LocationAndStoreProvider({ children }) {
  const [locationAndStore, setLocationAndStore] = useState({location : DEFAULT_LOCATION, storeSlotId:undefined});

  function setLocation(location){
    setLocationAndStore({...locationAndStore,location})
  }
  function setStoreSlotId(storeSlotId){
    setLocationAndStore({...locationAndStore,storeSlotId})
  }

  return (
    <LocationAndStoreContext.Provider
      value={{ location : locationAndStore.location,storeSlotId:locationAndStore.storeSlotId, setLocation,setStoreSlotId }}
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
