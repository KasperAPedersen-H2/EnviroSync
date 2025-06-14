import React from 'react';
import {Box, Button, Modal, TextField, Typography} from "@mui/material";
import { useAlert } from "../../../context/AlertContext";

const EditRoomModal = ({ editRoomModalOpen, setEditRoomModalOpen, currentRoom, setCurrentRoom, setRooms, rooms }) => {
    const { showAlert } = useAlert();

    const handleEditRoom = async () => {
        try {
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
            showAlert("success", "Room updated successfully");
        } catch(error) {
            showAlert("error", "Failed to update room");
        }
    };

    return (
        <Modal open={editRoomModalOpen} onClose={() => setEditRoomModalOpen(false)}>
            <Box sx={{ padding: 4, backgroundColor: "var(--card-bg)", margin: "20vh auto", width: "30%" }}>
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
                    sx={{ backgroundColor: "var(--btn-bg)" }}
                >
                    Save Changes
                </Button>
            </Box>
        </Modal>
    );
};

export default EditRoomModal;