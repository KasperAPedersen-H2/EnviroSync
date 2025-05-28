import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Importér korrekt fra jwt-decode

const SessionContext = createContext();

export const useSession = () => useContext(SessionContext);

const getSessionFromLocalStorage = () => {
    const token = localStorage.getItem("token");
    if (token) {
        try {
            const decoded = jwtDecode(token); // Dekoder token
            return { id: decoded.id, username: decoded.username }; // Returnér både id og username
        } catch (error) {
            console.error("Ugyldig token. Log ind igen.", error);
            localStorage.removeItem("token");
        }
    }
    return null; // Ingen session ved manglende eller ugyldig token
};


const SessionProvider = ({ children }) => {
    // Initialiser `session` baseret på `localStorage`
    const [session, setSession] = useState(getSessionFromLocalStorage);

    useEffect(() => {
        // Tjek for token ved førstegangsrendring (valgfrit, da initial value allerede er håndteret)
        const token = localStorage.getItem("token");
        if (token && !session) {
            try {
                const decoded = jwtDecode(token);
                setSession(decoded);
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