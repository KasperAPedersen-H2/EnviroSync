import React, { createContext, useContext, useState, useEffect } from 'react';

const AvatarContext = createContext();

export const AvatarProvider = ({ children }) => {
    const [globalAvatar, setGlobalAvatar] = useState(null);

    // Hent initial avatar når komponenten mountes
    useEffect(() => {
        const fetchInitialAvatar = async () => {
            const userId = JSON.parse(localStorage.getItem('session'))?.id;
            if (!userId) return;

            try {
                const response = await fetch(`http://localhost:5000/user/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (response.ok) {
                    const userData = await response.json();
                    if (userData.avatar) {
                        setGlobalAvatar(userData.avatar);
                    }
                }
            } catch (error) {
                console.error("Error fetching initial avatar:", error);
            }
        };

        fetchInitialAvatar();
    }, []);

    return (
        <AvatarContext.Provider value={{ globalAvatar, setGlobalAvatar }}>
            {children}
        </AvatarContext.Provider>
    );
};

export const useAvatar = () => {
    const context = useContext(AvatarContext);
    if (!context) {
        throw new Error('useAvatar must be used within an AvatarProvider');
    }
    return context;
};