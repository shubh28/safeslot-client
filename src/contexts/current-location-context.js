import React, { useState, createContext, useContext } from "react";

const CurrentLocationContext = createContext();

function CurrentLocationProvider({ children }) {
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 28.69999999999997,
    longitude: 77.19999999999999
  });

  return (
    <CurrentLocationContext.Provider
      value={{ currentLocation, setCurrentLocation }}
    >
      {children}
    </CurrentLocationContext.Provider>
  );
}

function useCurrentLocationContext() {
  const context = useContext(CurrentLocationContext);
  if (!context) {
    throw new Error(
      `useCurrentLocationContext must be use inside CurrentLocationProvider`
    );
  }
  return context;
}

export { CurrentLocationProvider, useCurrentLocationContext };
