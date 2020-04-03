import React, { useState, createContext, useContext } from "react";

const LocationAndStoreContext = createContext();

function LocationAndStoreProvider({ children }) {
  const [locationAndStore, setLocationAndStore] = useState({location : {
    latitude: 28.63298099999998,
    longitude: 77.21928800000002
  }, storeSlotId:undefined});

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
