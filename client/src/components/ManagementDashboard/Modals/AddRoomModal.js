import React, { useState } from "react";
import { Box, Button, Modal, TextField, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useAlert } from "../../../context/AlertContext";

const AddRoomModal = ({ roomModalOpen, setRoomModalOpen, setRooms, rooms }) => {
    const [newRoomName, setNewRoomName] = useState("");
    const { showAlert } = useAlert();

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const handleAddRoom = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/room/new`, {
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
            showAlert("success", "Room created successfully");
        } catch (error) {
            showAlert("error", "Failed to create room");
        }
    };

    return (
        <Modal
            open={roomModalOpen}
            onClose={() => setRoomModalOpen(false)}
        >
            <Box
                sx={{
                    padding: 4,
                    backgroundColor: "var(--card-bg)",
                    width: isSmallScreen ? "90%" : "30%",
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
                    sx={{
                        backgroundColor: "var(--btn-bg)",
                        width: "100%",
                        padding: isSmallScreen ? "10px" : "14px",
                    }}
                >
                    Create Room
                </Button>
            </Box>
        </Modal>
    );
};

export default AddRoomModal;