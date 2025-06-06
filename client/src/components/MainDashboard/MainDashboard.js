import React from "react";
import "./MainDashboard.css";
import { useRoomDevice } from "../../context/RoomDeviceContext";

const MainDashboard = () => {
    const { selectedRoom, selectedDevice } = useRoomDevice();

    return (
        <>
            <h3>Selected Room: {selectedRoom || "None"}</h3>
            <h3>Selected Device: {selectedDevice || "None"}</h3>
        </>
    );
};

export default MainDashboard;