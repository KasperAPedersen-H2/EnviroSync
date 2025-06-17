import React, {useState} from 'react';
import {Box, Button, Modal, TextField, Typography} from "@mui/material";
import { useAlert } from "../../../context/AlertContext";

const AddDeviceModal = ({ deviceModalOpen, setDeviceModalOpen, rooms, setRooms, setDevices }) => {
    const [newDeviceName, setNewDeviceName] = useState("");
    const [selectedRoomForDevice, setSelectedRoomForDevice] = useState("");
    const [newDeviceSerial, setNewDeviceSerial] = useState("");
    const { showAlert } = useAlert();

    const handleAddDevice = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/device/new`, {
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

            if (!response.ok) {
                showAlert("error", "Failed to create device");
                return;
            }

            const updatedRoomsResponse = await fetch(`${process.env.REACT_APP_SERVER_URL}/room/all`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            const roomsData = await updatedRoomsResponse.json();
            setRooms(roomsData);

            const devicesPromises = roomsData.map(room =>
                fetch(`${process.env.REACT_APP_SERVER_URL}/device/${room.id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                })
                    .then(response => response.json())
                    .then(devices => devices || [])
                    .catch(() => [])
            );

            const devicesArrays = await Promise.all(devicesPromises);
            const allDevices = devicesArrays.flat();
            setDevices(allDevices);

            setNewDeviceName("");
            setNewDeviceSerial("");
            setSelectedRoomForDevice("");
            setDeviceModalOpen(false);
            showAlert("success", "Device created successfully");
        } catch (error) {
            showAlert("error", "Failed to create device");
        }
    };

    return (
        <Modal
            open={deviceModalOpen}
            onClose={() => setDeviceModalOpen(false)}
        >
            <Box
                sx={{
                    padding: 4,
                    backgroundColor: "var(--card-bg)",
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
                    <option value="" disabled hidden></option>
                    {rooms.map((room) => (
                        <option key={room.id} value={room.id}>
                            {room.name}
                        </option>
                    ))}
                </TextField>

                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleAddDevice}
                    disabled={!newDeviceName || !newDeviceSerial || !selectedRoomForDevice}
                    sx={{ backgroundColor: "var(--btn-bg)" }}
                >
                    Create Device
                </Button>
            </Box>
        </Modal>
    );
};

export default AddDeviceModal;