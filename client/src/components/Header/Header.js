import React, {useEffect, useState} from "react";
import useSessionCheck from "../../hooks/useSessionCheck";

import Dropdown from "./Dropdown/Dropdown";
import "./Header.css"; // Importerer styling

const Header = () => {
    const [username, setUsername] = useState("");
    const session = useSessionCheck(); // Tjek session via hook

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Hent brugerdata fra API med brugerens id
                const response = await fetch(`http://localhost:5000/user/${session?.id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`, // Inkludér token
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUsername(data.username);
                } else {
                    alert("Kan ikke hente data. Prøv igen.");
                }
            } catch (error) {
                console.error("Fejl under hentning af data:", error);
            }
        };

        if (session?.id) {
            fetchDashboardData(); // Kun kald, hvis session.id er til stede
        }
    }, [session]);

    return (
        <header>
            <section className="name">
                <h2>EnviroSync</h2>
            </section>
            <section className="welcome">
                <Dropdown username={username} />
            </section>
        </header>
    );
};

export default Header;