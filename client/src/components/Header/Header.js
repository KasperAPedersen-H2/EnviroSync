import React, {useEffect, useState} from "react";
import useSessionCheck from "../../hooks/useSessionCheck";

import Dropdown from "./Dropdown/Dropdown";
import "./Header.css";

const Header = () => {
    const [username, setUsername] = useState("");
    const session = useSessionCheck();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/user/${session?.id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
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
            fetchDashboardData();
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