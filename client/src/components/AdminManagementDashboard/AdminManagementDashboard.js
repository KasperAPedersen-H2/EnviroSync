import React, { useState, useEffect } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Avatar,
    Button,
    Chip,
    IconButton
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import './AdminManagementDashboard.css';
import { useAlert } from "../../context/AlertContext";
import { useSession } from "../../context/SessionProvider";
import EditUserModal from "../Modals/EditUserModal";

const AdminManagementDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);

    const { showAlert } = useAlert();
    const { session } = useSession();

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);

            const url = `${process.env.REACT_APP_SERVER_URL}/user/all`;
            console.log("Fetching users from:", url);

            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    'Content-Type': 'application/json'
                },
            });

            console.log("Response status:", response.status);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error("Error response:", errorData);
                throw new Error(errorData.message || `Server returned ${response.status}`);
            }

            const data = await response.json();
            console.log("Fetched users:", data);
            setUsers(data);
        } catch (error) {
            console.error("Failed to load users:", error);
            setError(error.message);
            showAlert("error", "Failed to load users: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const getRoleColor = (role) => {
        switch(role?.toLowerCase()) {
            case 'admin':
                return 'error';
            case 'moderator':
                return 'warning';
            case 'user':
                return 'primary';
            default:
                return 'default';
        }
    };

    const handleEditUser = (userId) => {
        setSelectedUserId(userId);
        setEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setEditModalOpen(false);
        setSelectedUserId(null);

        fetchUsers();
    };

    return (
        <Box className="admin-dashboard">
            <Box className="admin-container">
                <Card className="admin-card">
                    <CardContent>
                        <Box className="admin-card-header">
                            <Typography variant="h5" className="admin-card-header-title">
                                User Management
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={fetchUsers}
                                disabled={loading}
                            >
                                Refresh Users
                            </Button>
                        </Box>
                        
                        {loading ? (
                            <Typography>Loading users...</Typography>
                        ) : error ? (
                            <Box>
                                <Typography color="error">Error: {error}</Typography>
                                <Button
                                    variant="outlined"
                                    onClick={fetchUsers}
                                    sx={{ mt: 2 }}
                                >
                                    Try Again
                                </Button>
                            </Box>
                        ) : (
                            <Table className="admin-table">
                                <TableHead className="admin-table-head">
                                    <TableRow>
                                        <TableCell className="admin-table-cell">Avatar</TableCell>
                                        <TableCell className="admin-table-cell">Username</TableCell>
                                        <TableCell className="admin-table-cell">Role</TableCell>
                                        <TableCell className="admin-table-cell">User ID</TableCell>
                                        <TableCell className="admin-table-cell">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody className="admin-table-body">
                                    {users.length > 0 ? (
                                        users.map((user) => (
                                            <TableRow key={user.id} className="admin-table-row">
                                                <TableCell className="admin-table-cell">
                                                    {user.avatar ? (
                                                        <Avatar 
                                                            src={`data:image/png;base64,${user.avatar}`} 
                                                            alt={user.username}
                                                        />
                                                    ) : (
                                                        <Avatar>{user.username.charAt(0).toUpperCase()}</Avatar>
                                                    )}
                                                </TableCell>
                                                <TableCell className="admin-table-cell">{user.username}</TableCell>
                                                <TableCell className="admin-table-cell">
                                                    <Chip
                                                        label={user.role || 'Unknown'}
                                                        color={getRoleColor(user.role)}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell className="admin-table-cell">{user.id}</TableCell>
                                                <TableCell className="admin-table-cell">
                                                    <IconButton
                                                        color="primary"
                                                        onClick={() => handleEditUser(user.id)}
                                                        aria-label="Edit user"
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="admin-table-cell" align="center">
                                                No users found
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </Box>

            {editModalOpen && (
                <EditUserModal 
                    id={selectedUserId}
                    isOpen={editModalOpen}
                    onClose={handleCloseEditModal}
                />
            )}
        </Box>
    );
};

export default AdminManagementDashboard;