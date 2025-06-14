import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    IconButton,
    Card,
    CardContent,
    Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import'./ManagementDashboard.css';
import { useAlert } from "../../context/AlertContext";

// Modals
import AddRoomModal from "./Modals/AddRoomModal";
import EditRoomModal from "./Modals/EditRoomModal";
import AddDeviceModal from "./Modals/AddDeviceModal";
import EditDeviceModal from "./Modals/EditDeviceModal";

const ManagementDashboard = () => {
    const [rooms, setRooms] = useState([]);
    const [devices, setDevices] = useState([]);
    const [roomModalOpen, setRoomModalOpen] = useState(false);
    const [deviceModalOpen, setDeviceModalOpen] = useState(false);
    const [editRoomModalOpen, setEditRoomModalOpen] = useState(false);
    const [editDeviceModalOpen, setEditDeviceModalOpen] = useState(false);
    const [currentRoom, setCurrentRoom] = useState({});
    const [currentDevice, setCurrentDevice] = useState({});
    const [selectedFilterRoom, setSelectedFilterRoom] = useState("");
    const { showAlert } = useAlert();

    useEffect(() => {
        const fetchRoomsAndDevices = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/room/all`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                const roomsData = await response.json();
                setRooms(roomsData);

                const devicesPromises = roomsData.map(room =>
                    fetch(`${process.env.REACT_APP_SERVER_URL}/room/${room.id}/devices`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                    })
                        .then(response => response.json())
                        .then(devices => devices || [])
                        .catch(() => [])
                );

                const devicesArrays = await Promise.all(devicesPromises);
                const allDevices = devicesArrays.flat();
                setDevices(allDevices || []);
            } catch (error) {
                console.error("Error fetching rooms and devices!");
            }
        };


        fetchRoomsAndDevices();
    }, []);


    const handleDeleteRoom = async (roomId) => {
        try {
            await fetch(`${process.env.REACT_APP_SERVER_URL}/room/${roomId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });

            setRooms(rooms.filter((room) => room.id !== roomId));
            showAlert("success", "Room deleted successfully");
        } catch (error) {
            showAlert("error", "Failed to delete room");
        }
    };

    const handleDeleteDevice = async (deviceId) => {
        try {
            await fetch(`${process.env.REACT_APP_SERVER_URL}/device/${deviceId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });

            setDevices(devices.filter((device) => device.id !== deviceId));
            showAlert("success", "Device deleted successfully");
        } catch (error) {
            showAlert("error", "Failed to delete device");
        }
    };

    return (
        <Box className="management-dashboard">
            <Box className="container">
                <Card className="card">
                    <CardContent>
                        <Box className="card-header">
                            <Typography variant="h5" className="card-header-title">Rooms</Typography>
                            <Button className="card-header-button"
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => setRoomModalOpen(true)}
                            >
                                Add Room
                            </Button>
                        </Box>
                        <Table>
                            <TableHead className="table-head">
                                <TableRow>
                                    <TableCell className="table-cell">Room Name</TableCell>
                                    <TableCell className="table-cell">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody className="table-body">
                                {rooms.map((room) => (
                                    <TableRow key={room.id} className="table-row">
                                        <TableCell className="table-cell">{room.name}</TableCell>
                                        <TableCell className="table-cell">
                                            <IconButton color="primary" onClick={() => {
                                                    setCurrentRoom(room);
                                                    setEditRoomModalOpen(true);
                                                }}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton color="error" onClick={() => {
                                                    handleDeleteRoom(room.id)
                                                }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card className="card">
                    <CardContent>
                        <Box className="card-header">
                            <Typography variant="h5" className="card-header-title">Devices</Typography>

                            <TextField select label="Filter by Room" value={selectedFilterRoom || ""}
                                onChange={(e) => {
                                    setSelectedFilterRoom(e.target.value);
                                }}
                                sx={{
                                    width: "200px",
                                }}
                                SelectProps={{
                                    native: true,
                                }}
                            >

                                <option value="" disabled hidden></option>
                                <option value="all">All Rooms</option>
                                {rooms.map((room) => (
                                    <option key={room.id} value={room.id}>
                                        {room.name}
                                    </option>
                                ))}
                            </TextField>

                            <Button
                                className="card-header-button"
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => setDeviceModalOpen(true)}
                            >
                                Add Device
                            </Button>
                        </Box>

                        <Table>
                            <TableHead className="table-head">
                                <TableRow>
                                    <TableCell className="table-cell">Device Name</TableCell>
                                    <TableCell className="table-cell">Room</TableCell>
                                    <TableCell className="table-cell">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody className="table-body">
                                {devices
                                    .filter((device) =>
                                        selectedFilterRoom === "all"
                                            ? true
                                            : selectedFilterRoom
                                                ? device.room_id === Number(selectedFilterRoom)
                                                : true
                                    )
                                    .map((device) => (
                                        <TableRow key={device.id}>
                                            <TableCell className="table-cell">{device.name}</TableCell>
                                            <TableCell className="table-cell">{rooms.find((room) => room.id === device.room_id)?.name || "Unknown"}</TableCell>
                                            <TableCell className="table-cell">
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => {
                                                        setCurrentDevice(device);
                                                        setEditDeviceModalOpen(true);
                                                    }}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton
                                                    color="error"
                                                    onClick={() => {
                                                        handleDeleteDevice(device.id);
                                                    }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </Box>

            <AddRoomModal
                roomModalOpen={roomModalOpen}
                setRoomModalOpen={setRoomModalOpen}
                setRooms={setRooms}
                rooms={rooms}
            />

            <AddDeviceModal
                deviceModalOpen={deviceModalOpen}
                setDeviceModalOpen={setDeviceModalOpen}
                rooms={rooms}
                setRooms={setRooms}
                setDevices={setDevices}
            />

            <EditRoomModal
                editRoomModalOpen={editRoomModalOpen}
                setEditRoomModalOpen={setEditRoomModalOpen}
                currentRoom={currentRoom}
                setCurrentRoom={setCurrentRoom}
                setRooms={setRooms}
                rooms={rooms}
            />

            <EditDeviceModal
                editDeviceModalOpen={editDeviceModalOpen}
                setEditDeviceModalOpen={setEditDeviceModalOpen}
                currentDevice={currentDevice}
                setCurrentDevice={setCurrentDevice}
                rooms={rooms}
                setRooms={setRooms}
                setDevices={setDevices}
            />
        </Box>
    );
};

export default ManagementDashboard;