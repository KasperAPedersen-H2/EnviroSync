import React from 'react';
import {Box, Button, Modal, TextField, Typography} from "@mui/material";

const EditDeviceModal = ({ editDeviceModalOpen, setEditDeviceModalOpen, currentDevice, setCurrentDevice, rooms, setRooms, setDevices }) => {

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

            if (!response.ok) {
                throw new Error('Failed to update device');
            }

            await response.json();

            // Fetch updated rooms data
            const updatedRoomsResponse = await fetch(`${process.env.REACT_APP_SERVER_URL}/room/all`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            const roomsData = await updatedRoomsResponse.json();
            setRooms(roomsData);

            // Fetch devices for all rooms
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
            setDevices(allDevices);

            setEditDeviceModalOpen(false);
        } catch (error) {
            console.error("Error updating device:", error);
        }
    };

    return (
        <Modal open={editDeviceModalOpen} onClose={() => setEditDeviceModalOpen(false)}>
            <Box sx={{ padding: 4, backgroundColor: "var(--card-bg)", margin: "20vh auto", width: "30%" }}>
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
                    <option value="" disabled hidden></option>
                    {rooms.map((room) => (
                        <option key={room.id} value={room.id}>
                            {room.name}
                        </option>
                    ))}
                </TextField>
                <Button
                    variant="contained"
                    onClick={handleEditDevice}
                    sx={{ backgroundColor: "var(--btn-bg)" }}
                >
                    Save Changes
                </Button>
            </Box>
        </Modal>
    );
};

export default EditDeviceModal;