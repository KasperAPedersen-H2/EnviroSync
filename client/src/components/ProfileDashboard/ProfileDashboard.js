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
import {useAlert} from "../../context/AlertContext";

const ProfileDashboard = () => {
    const [avatar, setAvatar] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const session = useSessionCheck();
    const { globalAvatar, setGlobalAvatar } = useAvatar();
    const { showAlert } = useAlert();
    const [editFormData, setEditFormData] = useState({
        username: '',
        email: ''
    });
    const [expandedFields, setExpandedFields] = useState({
        username: false,
        email: false
    });

    useEffect(() => {
        if (session?.id) {
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
                            const userData = await response.json();
                            if (userData.avatar) {
                                setPreviewUrl(`data:image/png;base64,${userData.avatar}`);
                                setGlobalAvatar(userData.avatar);
                            }

                            setEditFormData({
                                username: userData.username || '',
                                email: userData.email || ''
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
            // Vis preview af det valgte billede
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

    const handeEditProfile = () => {
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
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/user/${session?.id}/edit`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(editFormData)
            });

            if (response.ok) {
                closeEditModal();
            } else {
                showAlert("error", "Profile update failed");
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
                                <span>{session?.username || "Not available"}</span>
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
                            <button className="btn change-password">
                                Change Password
                            </button>
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
                    <button className="btn primary" onClick={handeEditProfile}>
                        <EditIcon className="btn-icon" /> Edit Profile
                    </button>
                </footer>
            </article>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Edit Profile</h2>
                            <button className="close-modal-btn" onClick={closeEditModal}>
                                <CloseIcon />
                            </button>
                        </div>
                        <form onSubmit={handleEditFormSubmit} className="edit-profile-form">
                            <div className={`form-group dropdown ${expandedFields.username ? 'expanded' : ''}`}>
                                <div className="dropdown-header" onClick={() => toggleField('username')}>
                                    <label htmlFor="username">Change Username</label>
                                    <KeyboardArrowDownIcon className="dropdown-icon" />
                                </div>
                                <div className="dropdown-content">
                                    <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        value={editFormData.username}
                                        onChange={handleEditFormChange}
                                        placeholder="Enter new username"
                                    />
                                </div>
                            </div>
                            <div className={`form-group dropdown ${expandedFields.email ? 'expanded' : ''}`}>
                                <div className="dropdown-header" onClick={() => toggleField('email')}>
                                    <label htmlFor="email">Change Email</label>
                                    <KeyboardArrowDownIcon className="dropdown-icon" />
                                </div>
                                <div className="dropdown-content">
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={editFormData.email}
                                        onChange={handleEditFormChange}
                                        placeholder="Enter new email"
                                    />
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn secondary" onClick={closeEditModal}>Cancel</button>
                                <button type="submit" className="btn primary">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
};

export default ProfileDashboard;