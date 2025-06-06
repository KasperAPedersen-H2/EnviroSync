import React, {useEffect, useState} from "react";
import "./MainDashboard.css";
import { useRoomDevice } from "../../context/RoomDeviceContext";

const MainDashboard = () => {
    const { selectedRoom, selectedDevice } = useRoomDevice();
    const [ liveData, setLiveData ] = useState(null);

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

    return (
        <>
            <section className="live">
                {console.log(liveData)}
                <article className="card">
                    <p>Temperature</p>
                    <p>{ liveData && liveData.temperature }</p>
                </article>

                <article className="card">
                    <p>Humidity</p>
                    <p>{ liveData && liveData.humidity }</p>
                </article>

                <article className="card">
                    <p>Pressure</p>
                    <p>{ liveData && liveData.pressure }</p>
                </article>

            </section>
        </>
    );
};

export default MainDashboard;