import React, { createContext, useState, useContext } from "react";

// Opret Context
const RoomDeviceContext = createContext();

// Custom Hook for at tilgå contexten
export const useRoomDevice = () => {
    return useContext(RoomDeviceContext);
};

// Provider-komponent
const RoomDeviceProvider = ({ children }) => {
    const [selectedRoom, setSelectedRoom] = useState("");
    const [selectedDevice, setSelectedDevice] = useState("");

    return (
        <RoomDeviceContext.Provider
            value={{
                selectedRoom,
                setSelectedRoom,
                selectedDevice,
                setSelectedDevice,
            }}
        >
            {children}
        </RoomDeviceContext.Provider>
    );
};

export default RoomDeviceProvider;