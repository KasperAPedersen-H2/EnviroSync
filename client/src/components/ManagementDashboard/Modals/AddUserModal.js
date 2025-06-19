import React, { useState } from "react";
import { Box, Modal, Typography, TextField, Button } from "@mui/material";
import { useAlert } from "../../../context/AlertContext";

const AddUserModal = ({ addUserModalOpen, setAddUserModalOpen, currentRoom, setRoomUsers }) => {
    const { showAlert } = useAlert();
    const [newUsername, setNewUsername] = useState("");
    const [isAddingUser, setIsAddingUser] = useState(false);

    const handleAddUser = async () => {
        if (!newUsername.trim()) {
            showAlert("error", "Please enter a valid username");
            return;
        }

        try {
            setIsAddingUser(true);
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/room/${currentRoom.id}/add-user`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ username: newUsername }),
            });

            if (!response.ok) {
                const errorMessage = (await response.json()).message || "Failed to add user to the room";
                throw new Error(errorMessage);
            }

            const addedUser = await response.json();
            setRoomUsers((prevRoomUsers) => [...prevRoomUsers, addedUser]);
            showAlert("success", "User added successfully!");
            setNewUsername("");
            setAddUserModalOpen(false);
        } catch (error) {
            showAlert("error", error.message);
        } finally {
            setIsAddingUser(false);
        }
    };

    return (
        <Modal open={addUserModalOpen} onClose={() => setAddUserModalOpen(false)}>
            <Box
                sx={{
                    padding: 4,
                    backgroundColor: "var(--card-bg)",
                    margin: "20vh auto",
                    width: "30%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                }}
            >
                <Typography variant="h6">{`Add a New User to Room: ${currentRoom.name}`}</Typography>

                <TextField
                    fullWidth
                    label="Username"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                />
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                    <Button
                        variant="outlined"
                        onClick={() => setAddUserModalOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddUser}
                        disabled={isAddingUser}
                    >
                        {isAddingUser ? "Adding..." : "Add User"}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default AddUserModal;