import React, {useEffect, useState} from "react";
import useSessionCheck from "../../hooks/useSessionCheck";
import { useRoomDevice } from '../../context/RoomDeviceContext';
import Dropdown from "./Dropdown/Dropdown";
import "./Header.css";
import { useAvatar } from "../../context/AvatarContext";

const Header = () => {
    const [username, setUsername] = useState("");
    const { globalAvatar } = useAvatar();
    const [rooms, setRooms] = useState([]);
    const [devices, setDevices] = useState([]);

    const session = useSessionCheck();
    const { selectedRoom, setSelectedRoom, selectedDevice, setSelectedDevice } = useRoomDevice();


    useEffect(() => {
        (async () => {
            try {
                if(!session?.id) return;

                const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/user/${session?.id}`, {
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
            } catch (error) {
                console.error("Fejl under hentning af data:", error);
            }
        })();
    }, [session]);

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/room/all`, {
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
                const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/device/${selectedRoom}`, {
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
                    ))}
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
                        <option key={device.sensor_id} value={device.sensor_id}>
                            {device.name}
                        </option>
                    ))}
                </select>
            </nav>
            
            <section className="welcome">
                <Dropdown username={username} avatarData={globalAvatar} />
            </section>
        </header>
    );
};

export default Header;