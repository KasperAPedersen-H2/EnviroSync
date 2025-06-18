import React, { useState, useEffect } from "react";
import useSessionCheck from "../../hooks/useSessionCheck";
import "./ProfileDashboard.css";
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import SecurityIcon from '@mui/icons-material/Security';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { PhotoCamera } from '@mui/icons-material';
import { useAvatar } from "../../context/AvatarContext";
import { useAlert } from "../../context/AlertContext";

const ProfileDashboard = () => {
    const [avatar, setAvatar] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const session = useSessionCheck();
    const { globalAvatar, setGlobalAvatar } = useAvatar();
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

    useEffect(() => {
        if (session?.id) {
            setUserData({
                username: session?.username || '',
                email: session?.email || ''
            });
            
            if (globalAvatar) {
                setPreviewUrl(`data:image/png;base64,${globalAvatar}`);
            } else {
                const fetchUserData = async () => {
                    try {
                        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/user/${session?.id}`, {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                            },
                        });

                        if (response.ok) {
                            const fetchedUserData = await response.json();
                            if (fetchedUserData.avatar) {
                                setPreviewUrl(`data:image/png;base64,${fetchedUserData.avatar}`);
                                setGlobalAvatar(fetchedUserData.avatar);
                            }
                            
                            setUserData({
                                username: fetchedUserData.username || '',
                                email: fetchedUserData.email || ''
                            });

                            setEditFormData({
                                username: fetchedUserData.username || '',
                                email: fetchedUserData.email || '',
                                password: '',
                                newPassword: '',
                                confirmPassword: ''
                            });
                        }
                    } catch (error) {
                        showAlert("error", "Failed to fetch user data");
                    }
                };
                fetchUserData();
            }
        }
    }, [session, globalAvatar]);


    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setAvatar(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!avatar) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('avatar', avatar);

        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/user/${session?.id}/avatar`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: formData
            });

            if (response.ok) {
                const userData = await response.json();
                setGlobalAvatar(userData.avatar);
                setIsUploading(false);
            } else {
                throw new Error('Upload failed');
            }
        } catch (error) {
            setIsUploading(false);
            showAlert("error", "Upload failed");
        }
    };


    const triggerFileInput = () => {
        document.getElementById('avatar-upload').click();
    };

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
        <section className="profile-dashboard">
            <article className="profile-card">
                <section className="profile-header">
                    <section className="profile-avatar">
                        <article>
                            <figure onClick={triggerFileInput}>
                                <div>
                                    {previewUrl ? (
                                        <img src={previewUrl} alt="Profile avatar"/>
                                    ) : (
                                        <img src="img_avatar3.png" alt="Default avatar"/>
                                    )}
                                    <figcaption>
                                        <PhotoCamera aria-hidden="true" />
                                        <span>Change Photo</span>
                                    </figcaption>
                                </div>
                            </figure>

                            <form onSubmit={handleSubmit} aria-label="Avatar upload form">
                                <input type="file" id="avatar-upload" name="avatar-upload" accept="image/*" onChange={handleFileChange} aria-label="Choose profile picture" />

                                {avatar && (
                                    <button type="submit" disabled={isUploading} aria-busy={isUploading}>
                                        {isUploading ? 'Uploading...' : 'Save Changes'}
                                    </button>
                                )}
                            </form>
                        </article>
                    </section>
                    <section className="profile-details">
                        <article className="profile-article">
                            <h3>
                                <PersonIcon className="section-icon" />
                                Account Information
                            </h3>
                            <div className="profile-field">
                                <label>Username:</label>
                                <span>{userData.username || "Not available"}</span>
                            </div>
                            <div className="profile-field">
                                <label>Email:</label>
                                <span>{userData.email || "Not available"}</span>
                            </div>
                        </article>

                        <article className="profile-article">
                            <h3>
                                <SecurityIcon className="section-icon" />
                                Security
                            </h3>
                            <div className="profile-field">
                                <label>Password:</label>
                                <span>*********</span>
                            </div>
                        </article>
                    </section>
                </section>



                <article className="profile-article future-section">
                    <h3>
                        <BadgeIcon className="section-icon" />
                        Additional Information
                    </h3>
                    <p className="placeholder-text">
                        Section reserved for when additional user information or fields are required
                    </p>
                </article>

                <footer className="profile-actions">
                    <button className="btn primary" onClick={handleEditProfile}>
                        <EditIcon className="btn-icon" /> Edit Profile
                    </button>
                </footer>
            </article>

{isModalOpen && (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="edit-profile-title">
        <section className="modal-content">
            <header className="modal-header">
                <h2 id="edit-profile-title">Edit Profile</h2>
                <button 
                    className="close-modal-btn" 
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
                    <div className="dropdown-content password-change-fields">
                        <div className="password-field">
                            <label htmlFor="currentPassword">Current Password</label>
                            <input
                                type="password"
                                id="currentPassword"
                                name="password"
                                value={editFormData.password}
                                onChange={handleEditFormChange}
                                placeholder="Enter current password"
                            />
                        </div>
                        <div className="password-field">
                            <label htmlFor="newPassword">New Password</label>
                            <input
                                type="password"
                                id="newPassword"
                                name="newPassword"
                                value={editFormData.newPassword}
                                onChange={handleEditFormChange}
                                placeholder="Enter new password"
                            />
                        </div>
                        <div className="password-field">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={editFormData.confirmPassword}
                                onChange={handleEditFormChange}
                                placeholder="Confirm new password"
                            />
                        </div>
                    </div>
                </fieldset>
                
                <footer className="modal-actions">
                    <button type="button" className="btn secondary" onClick={closeEditModal}>Cancel</button>
                    <button type="submit" className="btn primary">Save Changes</button>
                </footer>
            </form>
        </section>
    </div>
)}
        </section>
    );
};

export default ProfileDashboard;