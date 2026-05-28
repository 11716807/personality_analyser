import React, { createContext, useContext, useState } from 'react';

// Create the context
const AuthContext = createContext();

// Create a provider component that holds the state
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPersonalProfileGenerated, setIsPersonalProfileGenerated] = useState(false);

  return <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, isPersonalProfileGenerated, setIsPersonalProfileGenerated}}>{children}</AuthContext.Provider>;
};

// Custom hook to use the Auth context
export const useAuth = () => {
  return useContext(AuthContext);
};
