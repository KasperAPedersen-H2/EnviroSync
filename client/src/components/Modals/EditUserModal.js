import React, { useState, useEffect } from "react";
import "./EditUserModal.css";
import { useSession } from "../../context/SessionProvider";

import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import { useAlert } from "../../context/AlertContext";

const EditUserModal = ({ id, isOpen, onClose }) => {
    const { showAlert } = useAlert();
    const { session } = useSession();

    const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

    const [editFormData, setEditFormData] = useState({
        username: '',
        email: '',
        password: '',
        newPassword: '',
        confirmPassword: '',
        role: ''
    });
    
    const [expandedFields, setExpandedFields] = useState({
        username: false,
        email: false,
        password: false,
        role: false
    });
    
    const [roles, setRoles] = useState([]);
    const [userRole, setUserRole] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    const fetchUserData = async (userId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (response.ok) {
                const userData = await response.json();
                setEditFormData({
                    username: userData.username || '',
                    email: userData.email || '',
                    password: '',
                    newPassword: '',
                    confirmPassword: '',
                    role_id: userData.role_id || ''
                });
                setUserRole(userData.role_id);
            }
        } catch (error) {
            showAlert("error", "Failed to fetch user data");
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/role/all`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (response.ok) {
                const rolesData = await response.json();
                setRoles(rolesData);
            }
        } catch (error) {
            console.error("Failed to fetch roles:", error);
        }
    };

    const checkIfAdmin = () => {
        setIsAdmin(session?.role === 2);
    };

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        checkIfAdmin();
        fetchRoles();

        if (id) {
            fetchUserData(id);
        } else if (session) {
            setEditFormData({
                username: session.username || '',
                email: session.email || '',
                password: '',
                newPassword: '',
                confirmPassword: '',
                role_id: session.role_id || ''
            });
            setUserRole(session.role_id);
        }
    }, [isOpen, id, session]);

    const handleEditFormChange = (event) => {
        const { name, value } = event.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const toggleField = (fieldName) => {
        setExpandedFields(prev => ({
            ...prev,
            [fieldName]: !prev[fieldName]
        }));
    };

    const handleEditFormSubmit = async (event) => {
        event.preventDefault();

        const isPasswordChangeAttempt = expandedFields.password &&
            editFormData.password &&
            editFormData.newPassword &&
            editFormData.confirmPassword;

        if (isPasswordChangeAttempt && editFormData.newPassword !== editFormData.confirmPassword) {
            showAlert("error", "New passwords do not match");
            return;
        }

        try {
            const userId = id || session?.id;

            if (!userId) {
                showAlert("error", "User ID is missing");
                return;
            }

            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/user/${userId}/edit`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(editFormData)
            });

            const data = await response.json();

            if (response.ok) {
                showAlert("success", "Profile updated successfully");

                setEditFormData(prev => ({
                    ...prev,
                    password: '',
                    newPassword: '',
                    confirmPassword: ''
                }));

                onClose();
            } else {
                if (data.message === "Validation failed" && data.errors && data.errors.length > 0) {
                    showAlert("error", data.errors[0]);
                } else if (data.message) {
                    showAlert("error", data.message);
                } else {
                    showAlert("error", "Profile update failed");
                }
            }
        } catch (error) {
            showAlert("error", "Profile update failed");
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="edit-profile-title">
            <section className="modal-content">
                <header className="modal-header">
                    <h2 id="edit-profile-title">Edit Profile</h2>
                    <button
                        className="close-btn"
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        <CloseIcon />
                    </button>
                </header>
                <form onSubmit={handleEditFormSubmit} className="edit-profile-form">
                    <fieldset className={`form-group dropdown ${expandedFields.username ? 'expanded' : ''}`}>
                        <legend className="dropdown-header" onClick={() => toggleField('username')}>
                            <span>Change Username</span>
                            <KeyboardArrowDownIcon className="dropdown-icon" />
                        </legend>
                        <div className="dropdown-content">
                            <div className="border-label-field">
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={editFormData.username}
                                    onChange={handleEditFormChange}
                                />
                                <label htmlFor="username">New Username</label>
                            </div>
                        </div>
                    </fieldset>
                    <fieldset className={`form-group dropdown ${expandedFields.email ? 'expanded' : ''}`}>
                        <legend className="dropdown-header" onClick={() => toggleField('email')}>
                            <span>Change Email</span>
                            <KeyboardArrowDownIcon className="dropdown-icon" />
                        </legend>
                        <div className="dropdown-content">
                            <div className="border-label-field">
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={editFormData.email}
                                    onChange={handleEditFormChange}
                                />
                                <label htmlFor="email">New Email</label>
                            </div>
                        </div>
                    </fieldset>
                    <fieldset className={`form-group dropdown ${expandedFields.password ? 'expanded' : ''}`}>
                        <legend className="dropdown-header" onClick={() => toggleField('password')}>
                            <span>Change Password</span>
                            <KeyboardArrowDownIcon className="dropdown-icon" />
                        </legend>
                        <div className="dropdown-content">
                            <div className="border-label-field">
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={editFormData.password}
                                    onChange={handleEditFormChange}
                                />
                                <label htmlFor="password">Current Password</label>
                            </div>
                            <div className="border-label-field">
                                <input
                                    type="password"
                                    id="newPassword"
                                    name="newPassword"
                                    value={editFormData.newPassword}
                                    onChange={handleEditFormChange}
                                />
                                <label htmlFor="newPassword">New Password</label>
                            </div>
                            <div className="border-label-field">
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={editFormData.confirmPassword}
                                    onChange={handleEditFormChange}
                                />
                                <label htmlFor="confirmPassword">Confirm New Password</label>
                            </div>
                        </div>
                    </fieldset>

                    {isAdmin && (
                        <>
                            <div className="admin-section-separator"></div>

                            <fieldset
                                className={`form-group dropdown admin-role-dropdown ${roleDropdownOpen ? 'expanded' : ''}`}
                            >
                                <legend
                                    className="dropdown-header"
                                    onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                                >
                                    <span>User Role Management</span>
                                    <ExpandMoreIcon className="dropdown-icon" />
                                </legend>

                                <div className="dropdown-content">
                                    <p>Select a role for this user:</p>

                                    <div className="role-options-container">
                                        {roles.map((role) => (
                                            <div
                                                key={role.id}
                                                className={`role-option role-option-${role.name.toLowerCase()} ${editFormData.role_id == role.id ? 'selected' : ''}`}
                                                onClick={() => {
                                                    setEditFormData({
                                                        ...editFormData,
                                                        role_id: role.id
                                                    });
                                                }}
                                            >
                                                {role.name}
                                            </div>
                                        ))}
                                    </div>

                                    {editFormData.role_id && (
                                        <div className={`selected-role selected-role-${roles.find(r => r.id == editFormData.role_id)?.name.toLowerCase() || 'user'}`}>
                                            Current selection:
                                            <span className={`selected-role-badge selected-role-badge-${roles.find(r => r.id == editFormData.role_id)?.name.toLowerCase() || 'user'}`}>
                            {roles.find(r => r.id == editFormData.role_id)?.name || 'Unknown'}
                        </span>
                                        </div>
                                    )}
                                </div>
                            </fieldset>
                        </>
                    )}


                    <footer className="modal-footer">
                        <button type="button" className="btn secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn primary">Save Changes</button>
                    </footer>
                </form>
            </section>
        </div>
    );
};

export default EditUserModal;