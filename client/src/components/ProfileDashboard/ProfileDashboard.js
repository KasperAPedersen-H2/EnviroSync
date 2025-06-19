import React, { useState, useEffect } from "react";
import useSessionCheck from "../../hooks/useSessionCheck";
import "./ProfileDashboard.css";
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import SecurityIcon from '@mui/icons-material/Security';
import EditIcon from '@mui/icons-material/Edit';

import { PhotoCamera } from '@mui/icons-material';
import { useAvatar } from "../../context/AvatarContext";
import { useAlert } from "../../context/AlertContext";
import EditUserModal from "../Modals/EditUserModal";

const ProfileDashboard = () => {
    const [avatar, setAvatar] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const session = useSessionCheck();
    const { globalAvatar, setGlobalAvatar } = useAvatar();
    const { showAlert } = useAlert();
    const [userData, setUserData] = useState({
        username: '',
        email: ''
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
                        }
                    } catch (error) {
                        showAlert("error", "Failed to fetch user data");
                    }
                };
                fetchUserData();
            }
        }
    }, [session, globalAvatar, setGlobalAvatar, showAlert]);


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
                    <button className="btn primary" onClick={() => setIsEditModalOpen(true)} aria-label="Edit profile">
                        <EditIcon className="btn-icon" /> Edit Profile
                    </button>
                </footer>
            </article>

            <EditUserModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
            />
        </section>
    );
};

export default ProfileDashboard;