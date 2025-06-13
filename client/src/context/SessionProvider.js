import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const SessionContext = createContext();

export const useSession = () => useContext(SessionContext);

const getSessionFromLocalStorage = () => {
    const token = localStorage.getItem("token");
    if (token) {
        try {
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            if (decoded.exp < currentTime) {
                localStorage.removeItem("token");
                return null;
            }
            return { id: decoded.id, username: decoded.username };
        } catch (error) {
            console.error("Ugyldig token. Log ind igen.", error);
            localStorage.removeItem("token");
        }
    }
    return null;
};

const SessionProvider = ({ children }) => {
    const [session, setSession] = useState(getSessionFromLocalStorage);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const currentTime = Date.now() / 1000;
                if (decoded.exp < currentTime) {
                    console.warn("Session udløbet. Log venligst ind igen.");
                    localStorage.removeItem("token");
                    setSession(null);
                } else if (!session) {
                    setSession(decoded);
                }
            } catch (error) {
                console.error("Token fejlede ved dekodning.", error);
                localStorage.removeItem("token");
            }
        }
    }, [session]);

    return (
        <SessionContext.Provider value={{ session, setSession }}>
            {children}
        </SessionContext.Provider>
    );
};

export default SessionProvider;