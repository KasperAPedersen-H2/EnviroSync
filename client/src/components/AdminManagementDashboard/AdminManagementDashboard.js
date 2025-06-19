import React, {useState, useEffect, useCallback} from "react";
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
    Chip,
    IconButton,
    TextField,
    InputAdornment
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import RefreshIcon from '@mui/icons-material/Refresh';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import SettingsIcon from '@mui/icons-material/Settings';
import SearchIcon from '@mui/icons-material/Search';
import LoadingSpinnerMUI from "./LoadingSpinnerMUI";
import './AdminManagementDashboard.css';
import { useAlert } from "../../context/AlertContext";
import EditUserModal from "../Modals/EditUserModal";

const AdminManagementDashboard = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const { showAlert } = useAlert();

    const fetchUsers = useCallback( async () => {
        try {
            setLoading(true);
            setError(null);

            const url = `${process.env.REACT_APP_SERVER_URL}/user/all`;

            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error("Error response:", errorData);
                throw new Error(errorData.message || `Server returned ${response.status}`);
            }

            const data = await response.json();
            setUsers(data);
            setFilteredUsers(data);
        } catch (error) {
            console.error("Failed to load users:", error);
            setError(error.message);
            showAlert("error", "Failed to load users: " + error.message);
        } finally {
            setLoading(false);
        }
    }, [showAlert]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredUsers(users);
        } else {
            const lowerCaseQuery = searchQuery.toLowerCase();
            const filtered = users.filter(user => 
                user.username?.toLowerCase().includes(lowerCaseQuery) || 
                user.id?.toString().includes(lowerCaseQuery) ||
                user.role?.toLowerCase().includes(lowerCaseQuery)
            );
            setFilteredUsers(filtered);
        }
    }, [searchQuery, users]);

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

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    return (
        <Box className="admin-dashboard">
            <Box className="admin-container">
                <Card
                    className="admin-card"
                    sx={{
                        borderRadius: '8px',
                        boxShadow: '0 2px 15px rgba(0, 0, 0, 0.1)',
                        padding: '0',
                        borderTop: '4px solid var(--moonstone)'
                    }}
                >
                    <CardContent>
                        <Box
                            className="admin-card-header"
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '30px',
                                paddingBottom: '20px',
                                borderBottom: '1px solid var(--border)'
                            }}
                        >
                            <Typography variant="h5" className="admin-card-header-title">
                                User Management
                            </Typography>
                            <Box className="admin-search-container">
                                <TextField
                                    placeholder="Search users..."
                                    variant="outlined"
                                    size="small"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    className="admin-search-input"

                                    // Note: IntelliJ warns about InputProps being deprecated, but the direct approach doesn't work correctly
                                    // in Material UI v7. Keeping this approach until a better solution is found.
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <IconButton
                                    color="primary"
                                    onClick={fetchUsers}
                                    disabled={loading}
                                    aria-label="Refresh users"
                                    className={loading ? "refresh-loading" : ""}
                                    sx={{
                                        backgroundColor: 'var(--primary-button-bg)',
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: 'var(--primary-button-bg-hover)',
                                            transform: 'scale(1.1)',
                                        },
                                        transition: 'background-color 0.3s, transform 0.2s',
                                        marginLeft: '10px'
                                    }}
                                >
                                    {loading ? <RefreshIcon /> : <RefreshIcon />}
                                </IconButton>
                            </Box>
                        </Box>
                        
                        {loading ? (
                            <LoadingSpinnerMUI text="Loading Users"/>
                        ) : error ? (
                            <Box>
                                <Typography color="error">Error: {error}</Typography>
                                <IconButton
                                    color="primary"
                                    onClick={fetchUsers}
                                    sx={{ 
                                        mt: 2,
                                        backgroundColor: 'var(--primary-button-bg)',
                                        color: 'white'
                                    }}
                                >
                                    <RefreshIcon />
                                </IconButton>
                            </Box>
                        ) : (
                            <Table className="admin-table">
                                <TableHead className="admin-table-head">
                                    <TableRow>
                                        <TableCell className="table-header-cell">
                                            <PersonIcon className="table-header-icon" />
                                            Avatar
                                        </TableCell>
                                        <TableCell className="table-header-cell">
                                            <BadgeIcon className="table-header-icon" />
                                            Username
                                        </TableCell>
                                        <TableCell className="table-header-cell">
                                            <VpnKeyIcon className="table-header-icon" />
                                            Role
                                        </TableCell>
                                        <TableCell className="table-header-cell">
                                            <BadgeIcon className="table-header-icon" />
                                            User ID
                                        </TableCell>
                                        <TableCell className="table-header-cell">
                                            <SettingsIcon className="table-header-icon" />
                                            Actions
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody className="admin-table-body">
                                    {filteredUsers.length > 0 ? (
                                        filteredUsers.map((user) => (
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