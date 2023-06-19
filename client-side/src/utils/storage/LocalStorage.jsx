import React, { useEffect, useState, createContext, useContext } from "react";

const LocalStorageProviderContext = createContext();
const LocalStorageVariableProviderContext = createContext();

const LocalStorageProvider = ({ children }) => {
  const [usernameToken, setUsernameToken] = useState(null);

  useEffect(() => {
    setUsernameToken(localStorage.getItem("username"));
  }, []);

  const setToken = (id, token) => {
    localStorage.setItem(id, token);
    if (id === "username") {
      setUsernameToken(token);
    }
  };

  const removeToken = (id) => {
    localStorage.removeItem(id);
    if (id === "username") {
      setUsernameToken(null);
    }
  };

  return (
    <LocalStorageProviderContext.Provider value={{ setToken, removeToken }}>
      <LocalStorageVariableProviderContext.Provider value={{ usernameToken }}>
        {children}
      </LocalStorageVariableProviderContext.Provider>
    </LocalStorageProviderContext.Provider>
  );
};

const useLocalStorageContext = () => {
  return useContext(LocalStorageProviderContext);
};

const useLocalStorageVariableContext = () => {
  return useContext(LocalStorageVariableProviderContext);
};

export {
  LocalStorageProvider,
  useLocalStorageContext,
  useLocalStorageVariableContext,
};
