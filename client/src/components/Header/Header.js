import React, {useEffect, useState} from "react";
import useSessionCheck from "../../hooks/useSessionCheck";

import { useRoomDevice } from '../../context/RoomDeviceContext';
import Dropdown from "./Dropdown/Dropdown";
import "./Header.css";

const Header = () => {
    const [username, setUsername] = useState("");
    const [avatar, setAvatar] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [devices, setDevices] = useState([]);

    const session = useSessionCheck();
    const { selectedRoom, setSelectedRoom, selectedDevice, setSelectedDevice } = useRoomDevice();


    useEffect(() => {
        (async () => {
            try {
                if(!session?.id) return;

                const response = await fetch(`http://localhost:5000/user/${session?.id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if(!response.ok) {
                    if(response.status === 401 || response.status === 403) {
                        localStorage.removeItem("token");
                        session.setSession(null);
                    }
                    return;
                }

                const data = await response.json();
                setUsername(data.username);
                setAvatar(data.avatar);
            } catch (error) {
                console.error("Fejl under hentning af data:", error);
            }
        })();
    }, [session]);

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch("http://localhost:5000/room/all", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (!response.ok) {
                    return;
                }

                setRooms(await response.json());
            } catch (error) {
                console.error("Error fetching rooms:", error);
            }
        })();
    }, []);

    useEffect(() => {
        if (!selectedRoom) {
            setDevices([]);
            return;
        }

        (async () => {
            try {
                const response = await fetch(`http://localhost:5000/device/${selectedRoom}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (!response.ok) {
                    return;
                }

                setDevices(await response.json());
            } catch (error) {
                console.error("Error fetching devices:", error);
            }
        })();
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
                <Dropdown username={username} avatarData={avatar} />
            </section>
        </header>
    );
};

export default Header;