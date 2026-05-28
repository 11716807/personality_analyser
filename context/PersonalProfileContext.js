import React, { createContext, useContext, useState } from 'react';

// Create the context
const PersonalProfileContext = createContext();

// Create a provider component that holds the state
export const PersonalProfileProvider = ({ children }) => {
    const [isPersonalProfileGenerated, setIsPersonalProfileGenerated] = useState(false);

    return <PersonalProfileContext.Provider value={{ isPersonalProfileGenerated, setIsPersonalProfileGenerated }}>{children}</PersonalProfileContext.Provider>;
};

// Custom hook to use the Personal Profile context
export const usePersonalProfile = () => {
    return useContext(PersonalProfileContext);
};