import React from "react";
import { useSession } from "../../context/SessionProvider";
import "./ProfileDashboard.css";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import SecurityIcon from '@mui/icons-material/Security';
import EditIcon from '@mui/icons-material/Edit';

const ProfileDashboard = () => {
    const { session } = useSession();

    return (
        <div className="profile-dashboard">
            <h1 className="profile-title">User Profile</h1>

            <div className="profile-card">
                <div className="profile-header">
                    <div className="profile-avatar">
                        <AccountCircleIcon style={{ fontSize: 100, color: '#4FB0C6'}} />
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