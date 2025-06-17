import React, { useEffect, useState } from "react";

import "./MainDashboard.css";
import { useRoomDevice } from "../../context/RoomDeviceContext";
import HistoricChart from "./HistoricChart/HistoricChart";
import DeviceChat from "./DeviceChat/DeviceChat";
import socketService from "../../services/socketService";

const MainDashboard = () => {
    const { selectedDevice } = useRoomDevice();
    const [liveData, setLiveData] = useState(null);
    const [selectedDataType, setSelectedDataType] = useState("temperature");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        socketService.connect();

        socketService.on("new-data", (data) => {
            const { deviceId } = data;
            if(deviceId !== selectedDevice) {
                return;
            }

            fetchData();
        });

        const fetchData = async () => {
            if (!selectedDevice) return;

            setIsLoading(true);
            try {
                const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/data/latest/${selectedDevice}`, {
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
            } finally {
                setIsLoading(false);
            }
        };

        if (selectedDevice) {
            fetchData();
        } else {
            setLiveData(null);
        }

        return () => {
            socketService.disconnect();
        };
    }, [selectedDevice]);

    const handleCardClick = (type) => {
        setSelectedDataType(type);
    }

    const formatValue = (type, value) => {
        if (!value && value !== 0) return "-";
        
        switch(type) {
            case "temperature":
                return `${value}°C`;
            case "humidity":
                return `${value}%`;
            case "pressure":
                return `${value} ppm`;
            case "tvoc":
                return `${value} ppb`;
            default:
                return value;
        }
    };

    const getCardClass = () => {
        return `card ${isLoading ? 'loading' : ''}`;
    };

    return (
        <section className="main-dashboard">
            <section className="live">
                <article className={getCardClass()} onClick={() => handleCardClick("temperature")}>
                    <p>Temperature</p>
                    <p>{formatValue("temperature", liveData?.temperature)}</p>
                </article>

                <article className={getCardClass()} onClick={() => handleCardClick("humidity")}>
                    <p>Humidity</p>
                    <p>{formatValue("humidity", liveData?.humidity)}</p>
                </article>

                <article className={getCardClass()} onClick={() => handleCardClick("pressure")}>
                    <p>CO₂</p>
                    <p>{formatValue("pressure", liveData?.pressure)}</p>
                </article>

                <article className={getCardClass()} onClick={() => handleCardClick("tvoc")}>
                    <p>TVOC</p>
                    <p>{formatValue("tvoc", liveData?.tvoc)}</p>
                </article>
            </section>

            <section className="other">
                <HistoricChart deviceId={selectedDevice} selectedDataType={selectedDataType} />
                <DeviceChat deviceId={selectedDevice} />
            </section>
        </section>
    );
};

export default MainDashboard;