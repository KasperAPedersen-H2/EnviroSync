import React, { useState } from "react";
import { Box, Modal, Typography, List, ListItem, Divider, Button, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddUserModal from "./AddUserModal";
import { useAlert } from "../../../context/AlertContext";

const ViewRoomDetailsModal = ({
                                  viewRoomDetailsModalOpen,
                                  setViewRoomDetailsModalOpen,
                                  currentRoom,
                                  roomUsers,
                                  setRoomUsers,
                              }) => {
    const [addUserModalOpen, setAddUserModalOpen] = useState(false);
    const { showAlert } = useAlert();

    const handleRemoveUser = async (userId) => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_SERVER_URL}/room/${currentRoom.id}/remove-user`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({ user_id: userId }),
                }
            );

            if (!response.ok) {
                const errorMessage =
                    (await response.json()).message || "Failed to remove user from the room";
                throw new Error(errorMessage);
            }

            setRoomUsers((prevUsers) => prevUsers.filter((user) => user.user_id !== userId));
            showAlert("success", "User removed successfully!");
        } catch (error) {
            showAlert("error", error.message);
        }
    };

    return (
        <>
            <Modal open={viewRoomDetailsModalOpen} onClose={() => setViewRoomDetailsModalOpen(false)}>
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
                    <Typography variant="h6">{`Room: ${currentRoom.name}`}</Typography>

                    <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1">Users Associated with this Room:</Typography>
                        <List sx={{ maxHeight: "200px", overflowY: "auto", marginTop: 2 }}>
                            {roomUsers.length > 0 ? (
                                roomUsers.map((user, index) => (
                                    <React.Fragment key={user.id}>
                                        <ListItem
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                            }}
                                        >
                                            <span>
                                                (ID: {user.user_id}) {user.username}
                                            </span>
                                            <IconButton
                                                color="error"
                                                onClick={() => handleRemoveUser(user.user_id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </ListItem>
                                        {index < roomUsers.length - 1 && <Divider />}
                                    </React.Fragment>
                                ))
                            ) : (
                                <Typography variant="body2" sx={{ color: "gray" }}>
                                    No users found for this room.
                                </Typography>
                            )}
                        </List>
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 3, gap: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={() => setViewRoomDetailsModalOpen(false)}
                        >
                            Close
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => setAddUserModalOpen(true)}
                        >
                            Add User
                        </Button>
                    </Box>
                </Box>
            </Modal>

            <AddUserModal
                addUserModalOpen={addUserModalOpen}
                setAddUserModalOpen={setAddUserModalOpen}
                currentRoom={currentRoom}
                setRoomUsers={setRoomUsers}
            />
        </>
    );
};

export default ViewRoomDetailsModal;