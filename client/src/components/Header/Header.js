import React, {useEffect, useState} from "react";
import useSessionCheck from "../../hooks/useSessionCheck";

import { useRoomDevice } from '../../context/RoomDeviceContext';
import Dropdown from "./Dropdown/Dropdown";
import "./Header.css";

const Header = () => {
    const [username, setUsername] = useState("");
    const [rooms, setRooms] = useState([]);
    const [devices, setDevices] = useState([]);

    const session = useSessionCheck();
    const { selectedRoom, setSelectedRoom, selectedDevice, setSelectedDevice } = useRoomDevice();


    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/user/${session?.id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUsername(data.username);
                } else {
                    alert("Kan ikke hente data. Prøv igen.");
                }
            } catch (error) {
                console.error("Fejl under hentning af data:", error);
            }
        };

        if (session?.id) {
            fetchDashboardData();
        }
    }, [session]);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await fetch("http://localhost:5000/user/rooms", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setRooms(data);
                }
            } catch (error) {
                console.error("Error fetching rooms:", error);
            }
        };

        fetchRooms();
    }, []);

    useEffect(() => {
        if (selectedRoom) {
            const fetchDevices = async () => {
                try {
                    const response = await fetch(`http://localhost:5000/user/rooms/${selectedRoom}/devices`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setDevices(data);
                    }
                } catch (error) {
                    console.error("Error fetching devices:", error);
                }
            };

            fetchDevices();
        } else {
            setDevices([]);
        }
    }, [selectedRoom]);



    return (
        <header>
            <nav>
                <select
                    id="room-select"
                    value={selectedRoom}
                    onChange={(e) => {
                        setSelectedRoom(e.target.value);
                        setSelectedDevice("");
                    }}
                >
                    <option value="" disabled>
                        Choose Room
                    </option>
                    {rooms.map((room) => (
                        <option key={room.id} value={room.id}>
                            {room.name}
                        </option>
                    ))}x
                </select>

                <select
                    id="device-select"
                    value={selectedDevice}
                    onChange={(e) => setSelectedDevice(e.target.value)}
                    disabled={!selectedRoom}
                >
                    <option value="" disabled>
                        Choose Device
                    </option>
                    {devices.map((device) => (
                        <option key={device.id} value={device.id}>
                            {device.name}
                        </option>
                    ))}
                </select>

            </nav>
            <section className="welcome">
                <Dropdown username={username} />
            </section>
        </header>
    );
};

export default Header;