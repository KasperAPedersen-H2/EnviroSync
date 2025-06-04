import React from "react";
import { Link } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard"; // Importer Dashboard-ikonet
import "./Sidebar.css"; // Import af CSS-fil

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <section className="logo">
                <img src="logo_mono.png" alt="EnviroSync Logo"/>
                <h1>EnviroSync</h1>
            </section>
            <nav className="sidebar-nav">
                <Link to="/dashboard" className="sidebar-link">
                    <DashboardIcon />
                    Dashboard
                </Link>
                <Link to="/profile" className="sidebar-link">
                    <DashboardIcon />
                    Test
                </Link>
            </nav>
        </aside>
    );
};

export default Sidebar;