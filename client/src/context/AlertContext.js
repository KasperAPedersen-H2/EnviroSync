import React, { createContext, useContext, useState, useCallback } from "react";
import Alert from "../components/Alert/Alert"; // Husk: vejen skal passe til din projektstruktur

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const showAlert = useCallback((type, message) => {
    const id = Date.now() + Math.random();
    setAlerts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    }, 5000);
  }, []);

  const removeAlert = useCallback((id) => setAlerts((prev) => prev.filter((a) => a.id !== id)), []);

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <Alert alerts={alerts} onClose={removeAlert} />
    </AlertContext.Provider>
  );
};

// Hook
export const useAlert = () => useContext(AlertContext);