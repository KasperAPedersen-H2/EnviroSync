import React, { useEffect, useState } from "react";
import "./MainDashboard.css";
import { useRoomDevice } from "../../context/RoomDeviceContext";
import HistoricChart from "./HistoricChart/HistoricChart"; // Sti til HistoricChart

const MainDashboard = () => {
    const { selectedDevice } = useRoomDevice();
    const [ liveData, setLiveData ] = useState(null);
    const [ selectedDataType, setSelectedDataType ] = useState("temperature");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/user/data/latest/${selectedDevice}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (!response.ok) {
                    console.error("Failed to fetch data");
                    return;
                }

                const data = await response.json();
                setLiveData(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        if (selectedDevice) {
            fetchData();
        }
    }, [selectedDevice]);

    const handleCardClick = (type) => {
        setSelectedDataType(type);
    }

    return (
        <>
            <section className="live">
                <article className="card" onClick={() => handleCardClick("temperature")}>
                    <p>Temperature</p>
                    <p>{liveData && liveData.temperature}</p>
                </article>

                <article className="card" onClick={() => handleCardClick("humidity")}>
                    <p>Humidity</p>
                    <p>{liveData && liveData.humidity}</p>
                </article>

                <article className="card" onClick={() => handleCardClick("pressure")}>
                    <p>Pressure</p>
                    <p>{liveData && liveData.pressure}</p>
                </article>

                <article className="card" onClick={() => handleCardClick("tvoc")}>
                    <p>TVOC (ppb)</p>
                    <p>{liveData && liveData.tvoc}</p>
                </article>
            </section>

            <section className="other">
                <HistoricChart deviceId={selectedDevice} selectedDataType={selectedDataType} />
            </section>

        </>
    );
};

export default MainDashboard;