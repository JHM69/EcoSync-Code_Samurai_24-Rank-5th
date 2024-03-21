import React, { createContext, useContext, useState } from 'react';

// Create a context
const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setLoggedIn] = useState(false);

  // Function to update the login state
  function login() {
    setLoggedIn(true);
  }

  // Function to update the logout state
  function logout() {
    setLoggedIn(false);
  }

  // Provide the context values
  const contextValues = {
    isLoggedIn,
    login,
    logout,
  };

  // Provide the context to the components
  return (
    <AuthContext.Provider value={contextValues}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook to use the context
export const useAuth = () => {
  return useContext(AuthContext);
};