import React, { useState, useEffect } from "react";
import useSessionCheck from "../../hooks/useSessionCheck";
import "./ProfileDashboard.css";
import { PhotoCamera } from '@mui/icons-material';

const ProfileDashboard = () => {
    const [avatar, setAvatar] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const session = useSessionCheck();

    useEffect(() => {
        // Hent brugerens nuværende avatar
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
                    }
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        if (session?.id) {
            fetchUserData();
        }
    }, [session]);

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
        <>
            <section className="card">
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
            </section>
        </>
    );
};

export default ProfileDashboard;