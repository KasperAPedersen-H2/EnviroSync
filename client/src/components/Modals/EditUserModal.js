import React, { useState, useEffect } from "react";
import "./EditUserModal.css";

import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import { useAlert } from "../../context/AlertContext";

const EditUserModal = ({ id, session}) => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const { showAlert } = useAlert();
    const [userData, setUserData] = useState({
        username: '',
        email: ''
    });
    const [editFormData, setEditFormData] = useState({
        username: '',
        email: '',
    });
    const [expandedFields, setExpandedFields] = useState({
        username: false,
        email: false,
        password: false
    });

    const fetchUserData = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/user/${id}`, {
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
                    confirmPassword: ''
                });
            }
        } catch (error) {
            showAlert("error", "Failed to fetch user data");
        }
    };


    useEffect(() => {
        if (session) {
            setUser({
                username: session?.username || '',
                email: session?.email || '',
            });
        } else if (id) {
            fetchUserData();
        }
    }, [id, session, showAlert]);

    const handleEditProfile = () => {
        setIsModalOpen(true);
    };

    const closeEditModal = () => {
        setIsModalOpen(false);
    }

    const handleEditFormChange = (event) => {
        const { name, value } = event.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const toggleField = (fieldName) => {
        setExpandedFields(prev => ({
            ...prev,
            [fieldName]: !prev[fieldName]
        }));
    }

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
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/user/${session?.id}/edit`, {
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

                setUserData({
                    username: editFormData.username || '',
                    email: editFormData.email || ''
                });

                closeEditModal();

                setEditFormData(prev => ({
                    ...prev,
                    password: '',
                    newPassword: '',
                    confirmPassword: ''
                }));

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

    return (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="edit-profile-title">
            <section className="modal-content">
                <header className="modal-header">
                    <h2 id="edit-profile-title">Edit Profile</h2>
                    <button
                        className="close-button"
                        onClick={closeEditModal}
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
                            <label htmlFor="username" className="visually-hidden">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={editFormData.username}
                                onChange={handleEditFormChange}
                                placeholder="Enter new username"
                            />
                        </div>
                    </fieldset>
                    <fieldset className={`form-group dropdown ${expandedFields.email ? 'expanded' : ''}`}>
                        <legend className="dropdown-header" onClick={() => toggleField('email')}>
                            <span>Change Email</span>
                            <KeyboardArrowDownIcon className="dropdown-icon" />
                        </legend>
                        <div className="dropdown-content">
                            <label htmlFor="email" className="visually-hidden">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={editFormData.email}
                                onChange={handleEditFormChange}
                                placeholder="Enter new email"
                            />
                        </div>
                    </fieldset>
                    <fieldset className={`form-group dropdown ${expandedFields.password ? 'expanded' : ''}`}>
                        <legend className="dropdown-header" onClick={() => toggleField('password')}>
                            <span>Change Password</span>
                            <KeyboardArrowDownIcon className="dropdown-icon" />
                        </legend>
                        <div className="dropdown-content">
                            <label htmlFor="password" className="visually-hidden">Current Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={editFormData.password}
                                onChange={handleEditFormChange}
                                placeholder="Current password"
                            />
                            <label htmlFor="newPassword" className="visually-hidden">New Password</label>
                            <input
                                type="password"
                                id="newPassword"
                                name="newPassword"
                                value={editFormData.newPassword}
                                onChange={handleEditFormChange}
                                placeholder="New password"
                            />
                            <label htmlFor="confirmPassword" className="visually-hidden">Confirm New Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={editFormData.confirmPassword}
                                onChange={handleEditFormChange}
                                placeholder="Confirm new password"
                            />
                        </div>
                    </fieldset>
                    <footer className="modal-footer">
                        <button type="button" className="btn secondary" onClick={closeEditModal}>Cancel</button>
                        <button type="submit" className="btn primary">Save Changes</button>
                    </footer>
                </form>
            </section>
        </div>
    )
};

export default EditUserModal;