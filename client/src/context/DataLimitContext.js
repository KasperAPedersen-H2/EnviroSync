import React, { createContext, useContext, useState } from "react";

// Opret Context
const DataLimitContext = createContext();

// Custom Hook for at tilgå Context
export const useDataLimit = () => {
    return useContext(DataLimitContext);
};

// Provider-komponent
const DataLimitProvider = ({ children }) => {
    const [dataLimit, setDataLimit] = useState(20); // Standard data-limit

    return (
        <DataLimitContext.Provider value={{ dataLimit, setDataLimit }}>
            {children}
        </DataLimitContext.Provider>
    );
};

export default DataLimitProvider;