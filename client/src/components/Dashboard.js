import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useSession } from "./SessionProvider";

const Dashboard = () => {
    const [username, setUsername] = useState("");
    const { session } = useSession(); // Hent session med id og username
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!session || !session.id) {
                alert("Ingen login-session. Du bliver videresendt til login.");
                navigate("/login");
                return;
            }

            try {
                // Eksempel: Hent brugerdata fra API med `id`
                const response = await fetch(`http://localhost:5000/user/${session.id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`, // Inkludér token
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUsername(data.username); // Opdater brugernavn med svar
                } else {
                    alert("Kan ikke hente data. Prøv igen.");
                }
            } catch (error) {
                console.error("Fejl under hentning af data:", error);
            }
        };

        fetchDashboardData();
    }, [navigate, session]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        alert("Du er logget ud.");
        navigate("/login");
    };

    return (
        <div>
            <h2>Dashboard</h2>
            <p>Velkommen, {username}!</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Dashboard;