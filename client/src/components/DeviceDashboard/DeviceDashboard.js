import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Modal,
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

const DeviceDashboard = () => {
    const [rooms, setRooms] = useState([]);
    const [devices, setDevices] = useState([]);
    const [roomModalOpen, setRoomModalOpen] = useState(false);
    const [deviceModalOpen, setDeviceModalOpen] = useState(false);
    const [editRoomModalOpen, setEditRoomModalOpen] = useState(false);
    const [editDeviceModalOpen, setEditDeviceModalOpen] = useState(false);
    const [newRoomName, setNewRoomName] = useState("");
    const [newDeviceName, setNewDeviceName] = useState("");
    const [selectedRoomForDevice, setSelectedRoomForDevice] = useState("");
    const [newDeviceSerial, setNewDeviceSerial] = useState("");
    const [currentRoom, setCurrentRoom] = useState({});
    const [currentDevice, setCurrentDevice] = useState({});
    const [selectedFilterRoom, setSelectedFilterRoom] = useState("");

    useEffect(() => {
        const fetchRooms = async () => {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/room/all`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            const data = await response.json();
            setRooms(data);
        };

        const fetchDevices = async () => {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/device`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            const data = await response.json();
            setDevices(data);
        };

        fetchRooms();
        fetchDevices();
    }, []);

    const handleAddRoom = async () => {
        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/room`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ name: newRoomName, user_id: 1 }),
        });

        const newRoom = await response.json();
        setRooms([...rooms, newRoom]);
        setNewRoomName("");
        setRoomModalOpen(false);
    };

    const handleEditRoom = async () => {
        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/room/${currentRoom.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ name: currentRoom.name }),
        });

        const updatedRoom = await response.json();
        setRooms(rooms.map((room) => (room.id === updatedRoom.id ? updatedRoom : room)));
        setEditRoomModalOpen(false);
    };

    const handleDeleteRoom = async (roomId) => {
        await fetch(`${process.env.REACT_APP_SERVER_URL}/room/${roomId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        setRooms(rooms.filter((room) => room.id !== roomId));
    };

    const handleAddDevice = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/device`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    name: newDeviceName,
                    room_id: selectedRoomForDevice,
                    serial_number: newDeviceSerial,
                }),
            });

            const newDevice = await response.json();

            const updatedRoomsResponse = await fetch(`${process.env.REACT_APP_SERVER_URL}/room/all`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            const updatedRooms = await updatedRoomsResponse.json();

            const updatedDevicesResponse = await fetch(`${process.env.REACT_APP_SERVER_URL}/device`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            const updatedDevices = await updatedDevicesResponse.json();

            setRooms(updatedRooms);
            setDevices(updatedDevices);

            setNewDeviceName("");
            setNewDeviceSerial("");
            setSelectedRoomForDevice("");
            setDeviceModalOpen(false);
        } catch (error) {
            console.error("Error adding device:", error);
        }
    };

    const handleEditDevice = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/device/${currentDevice.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    name: currentDevice.name,
                    room_id: currentDevice.room_id,
                    serial_number: currentDevice.serial_number,
                }),
            });

            await response.json();

            const updatedRoomsResponse = await fetch(`${process.env.REACT_APP_SERVER_URL}/room/all`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            const updatedRooms = await updatedRoomsResponse.json();

            const updatedDevicesResponse = await fetch(`${process.env.REACT_APP_SERVER_URL}/device`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            const updatedDevices = await updatedDevicesResponse.json();

            setRooms(updatedRooms);
            setDevices(updatedDevices);

            setEditDeviceModalOpen(false);
        } catch (error) {
            console.error("Error updating device:", error);
        }
    };

    const handleDeleteDevice = async (deviceId) => {
        await fetch(`${process.env.REACT_APP_SERVER_URL}/device/${deviceId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        setDevices(devices.filter((device) => device.id !== deviceId));
    };

    return (
        <Box sx={{  }}>
            <Box
                sx={{
                    display: "flex",
                    gap: 4,
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                }}
            >
                <Card sx={{ flex: 1, minWidth: "calc(50% - 16px)", boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}>
                    <CardContent>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: 2,
                            }}
                        >
                            <Typography variant="h5" sx={{ color: "var(--text-dark)" }}>
                                Rooms
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => {
                                    setRoomModalOpen(true);
                                }}
                                sx={{
                                    padding: "6px 16px",
                                    backgroundColor: "var(--primary-button-bg)",
                                    fontWeight: "bold",
                                    "&:hover": { backgroundColor: "var(--primary-button-bg-hover)" },
                                }}
                            >
                                Add Room
                            </Button>
                        </Box>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: "bold" }}>Room Name</TableCell>
                                    <TableCell
                                        sx={{
                                            fontWeight: "bold",
                                            textAlign: "right",
                                        }}
                                    >
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rooms.map((room) => (
                                    <TableRow key={room.id}>
                                        <TableCell>{room.name}</TableCell>
                                        <TableCell
                                            sx={{
                                                textAlign: "right",
                                            }}
                                        >
                                            <IconButton
                                                color="primary"
                                                onClick={() => {
                                                    setCurrentRoom(room);
                                                    setEditRoomModalOpen(true);
                                                }}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                color="error"
                                                onClick={() => handleDeleteRoom(room.id)}
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

                <Card sx={{ flex: 1, minWidth: "calc(50% - 16px)", boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}>
                    <CardContent>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: 2,
                            }}
                        >
                            <Typography variant="h5" sx={{ color: "var(--text-dark)" }}>
                                Devices
                            </Typography>

                            <TextField
                                select
                                label="Filter by Room"
                                value={selectedFilterRoom || ""}
                                onChange={(e) => setSelectedFilterRoom(e.target.value)}
                                sx={{
                                    width: "200px",
                                }}
                                SelectProps={{
                                    native: true,
                                }}
                            >

                                <option value="" disabled selected hidden></option>
                                <option value="all">All Rooms</option>
                                {rooms.map((room) => (
                                    <option key={room.id} value={room.id}>
                                        {room.name}
                                    </option>
                                ))}
                            </TextField>

                            <Button
                                variant="contained"
                                color="secondary"
                                startIcon={<AddIcon />}
                                onClick={() => setDeviceModalOpen(true)}
                                sx={{
                                    padding: "6px 16px",
                                    backgroundColor: "var(--moonstone)",
                                    fontWeight: "bold",
                                    "&:hover": { backgroundColor: "var(--silver-lake-blue)" },
                                }}
                            >
                                Add Device
                            </Button>
                        </Box>

                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: "bold" }}>Device Name</TableCell>
                                    <TableCell sx={{ fontWeight: "bold" }}>Room</TableCell>
                                    <TableCell
                                        sx={{
                                            fontWeight: "bold",
                                            textAlign: "right",
                                        }}
                                    >
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
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
                                            <TableCell>{device.name}</TableCell>
                                            <TableCell>
                                                {rooms.find((room) => room.id === device.room_id)?.name || "Unknown"}
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    textAlign: "right",
                                                }}
                                            >
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
                                                    onClick={() => handleDeleteDevice(device.id)}
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

            {/* Add Room Modal */}
            <Modal
                open={roomModalOpen}
                onClose={() => setRoomModalOpen(false)}
            >
                <Box
                    sx={{
                        padding: 4,
                        backgroundColor: "white",
                        width: "30%",
                        margin: "20vh auto",
                        borderRadius: "8px",
                        boxShadow: 24,
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        Add Room
                    </Typography>
                    <TextField
                        fullWidth
                        label="Room Name"
                        value={newRoomName}
                        onChange={(e) => setNewRoomName(e.target.value)}
                        sx={{ marginBottom: 2 }}
                    />
                    <Button
                        variant="contained"
                        onClick={handleAddRoom}
                        sx={{ backgroundColor: "var(--primary-button-bg)" }}
                    >
                        Create Room
                    </Button>
                </Box>
            </Modal>

            {/* Add Device Modal */}
            <Modal
                open={deviceModalOpen}
                onClose={() => setDeviceModalOpen(false)}
            >
                <Box
                    sx={{
                        padding: 4,
                        backgroundColor: "white",
                        width: "30%",
                        margin: "20vh auto",
                        borderRadius: "8px",
                        boxShadow: 24,
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        Add Device
                    </Typography>

                    <TextField
                        fullWidth
                        label="Device Name"
                        value={newDeviceName}
                        onChange={(e) => setNewDeviceName(e.target.value)}
                        sx={{ marginBottom: 2 }}
                    />

                    <TextField
                        fullWidth
                        label="Serial Number"
                        value={newDeviceSerial}
                        onChange={(e) => setNewDeviceSerial(e.target.value)}
                        sx={{ marginBottom: 2 }}
                    />

                    <TextField
                        select
                        fullWidth
                        label="Select Room"
                        value={selectedRoomForDevice || ""}
                        onChange={(e) => setSelectedRoomForDevice(e.target.value)}
                        sx={{ marginBottom: 2 }}
                        SelectProps={{
                            native: true,
                        }}
                    >
                        <option value="" disabled selected hidden></option>
                        {rooms.map((room) => (
                            <option key={room.id} value={room.id}>
                                {room.name}
                            </option>
                        ))}
                    </TextField>

                    <Button
                        variant="contained"
                        onClick={handleAddDevice}
                        disabled={!newDeviceName || !newDeviceSerial || !selectedRoomForDevice}
                        sx={{ backgroundColor: "var(--primary-button-bg)" }}
                    >
                        Create Device
                    </Button>
                </Box>
            </Modal>

            {/* Edit Room Modal */}
            <Modal open={editRoomModalOpen} onClose={() => setEditRoomModalOpen(false)}>
                <Box sx={{ padding: 4, backgroundColor: "white", margin: "20vh auto", width: "30%" }}>
                    <Typography variant="h6">Edit Room</Typography>
                    <TextField
                        fullWidth
                        label="Room Name"
                        value={currentRoom.name || ""}
                        onChange={(e) => setCurrentRoom({ ...currentRoom, name: e.target.value })}
                        sx={{ marginBottom: 2 }}
                    />
                    <Button
                        variant="contained"
                        onClick={handleEditRoom}
                        sx={{ backgroundColor: "var(--primary-button-bg)" }}
                    >
                        Save Changes
                    </Button>
                </Box>
            </Modal>

            {/* Edit Device Modal */}
            <Modal open={editDeviceModalOpen} onClose={() => setEditDeviceModalOpen(false)}>
                <Box sx={{ padding: 4, backgroundColor: "white", margin: "20vh auto", width: "30%" }}>
                    <Typography variant="h6">Edit Device</Typography>
                    <TextField
                        fullWidth
                        label="Device Name"
                        value={currentDevice.name || ""}
                        onChange={(e) => setCurrentDevice({ ...currentDevice, name: e.target.value })}
                        sx={{ marginBottom: 2 }}
                    />
                    <TextField
                        select
                        fullWidth
                        label="Select Room"
                        value={currentDevice.room_id || ""}
                        onChange={(e) => setCurrentDevice({ ...currentDevice, room_id: e.target.value })}
                        sx={{ marginBottom: 2 }}
                        SelectProps={{
                            native: true,
                        }}
                    >
                        <option value="" disabled selected hidden></option>
                        {rooms.map((room) => (
                            <option key={room.id} value={room.id}>
                                {room.name}
                            </option>
                        ))}
                    </TextField>
                    <Button
                        variant="contained"
                        onClick={handleEditDevice}
                        sx={{ backgroundColor: "var(--primary-button-bg)" }}
                    >
                        Save Changes
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
};

export default DeviceDashboard;