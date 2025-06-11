import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from './SessionProvider';

const AvatarContext = createContext();

export const AvatarProvider = ({ children }) => {
    const [globalAvatar, setGlobalAvatar] = useState(null);
    const { session } = useSession();

    useEffect(() => {
        const fetchInitialAvatar = async () => {
            if (!session?.id) return;

            try {
                const response = await fetch(`http://localhost:5000/user/${session.id}`, {
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
    }, [session]);

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