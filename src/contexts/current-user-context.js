import React, { useState, createContext, useContext } from "react";
import { loadState } from "../helpers/LocalStorage";

const CurrentUserContext = createContext();

function CurrentUserProvider({ children }) {
  const token = loadState("userAuthenticationDetails");
  const [currentUser, setCurrentUser] = useState(
    token && token.id
      ? {
          userId: token.userId,
          token: token.id
        }
      : undefined
  );

  return (
    <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </CurrentUserContext.Provider>
  );
}

function useCurrentUserContext() {
  const context = useContext(CurrentUserContext);
  if (!context) {
    throw new Error(
      `useCurrentUserContext must be use inside CurrentUserProvider`
    );
  }
  return context;
}

export { CurrentUserProvider, useCurrentUserContext };
