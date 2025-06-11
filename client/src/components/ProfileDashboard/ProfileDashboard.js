import React, { useState, useEffect } from "react";
import useSessionCheck from "../../hooks/useSessionCheck";
import "./ProfileDashboard.css";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import SecurityIcon from '@mui/icons-material/Security';
import EditIcon from '@mui/icons-material/Edit';
import { PhotoCamera } from '@mui/icons-material';
import { useAvatar } from "../../context/AvatarContext";

const ProfileDashboard = () => {
    const [avatar, setAvatar] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const session = useSessionCheck();
    const { globalAvatar, setGlobalAvatar } = useAvatar();


    useEffect(() => {
        if (session?.id) {
            if (globalAvatar) {
                setPreviewUrl(`data:image/png;base64,${globalAvatar}`);
            } else {
                // Hent brugerens nuværende avatar hvis global ikke findes
                const fetchUserData = async () => {
                    try {
                        const response = await fetch(`http://localhost:5000/user/${session?.id}`, {
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
                        }
                    } catch (error) {
                        console.error("Error fetching user data:", error);
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
            const response = await fetch(`http://localhost:5000/user/${session?.id}/avatar`, {
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
            console.error('Error uploading avatar:', error);
        }
    };


    const triggerFileInput = () => {
        document.getElementById('avatar-upload').click();
    };
    return (
        <div className="profile-dashboard">
            <h1 className="profile-title">User Profile</h1>

            <div className="profile-card">
                <div className="profile-header">
                    <div className="profile-avatar">
                        <h1 className="title">Change Avatar</h1>
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
                    </div>
                    <div className="profile-info">
                        <h2>{session?.username || "Username not available"}</h2>
                        <p className="profile-id">User ID: {session?.id || "ID not available"}</p>
                    </div>
                </div>

                <div className="profile-details">
                    <div className="profile-section">
                        <h3>
                            <PersonIcon className="section-icon" />
                            Account Information
                        </h3>
                        <div className="profile-field">
                            <label>Username:</label>
                            <span>{session?.username || "Not available"}</span>
                        </div>
                        <div className="profile-field">
                            <label>User ID:</label>
                            <span>{session?.id || "Not available"}</span>
                        </div>
                    </div>

                    <div className="profile-section">
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
                    </div>
                </div>

                <div className="profile-section future-section">
                    <h3>
                        <BadgeIcon className="section-icon" />
                        Additional Information
                    </h3>
                    <p className="placeholder-text">
                        Section reserved for when additional user information or fields are required
                    </p>
                </div>

                <div className="profile-actions">
                    <button className="btn primary">
                        <EditIcon className="btn-icon" /> Edit Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileDashboard;
