import React from "react";
import DashboardIcon from "@mui/icons-material/Dashboard"; // Importer Dashboard-ikonet
import "./Sidebar.css"; // Import af CSS-fil

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <section className="logo">
                <img src="logo.png" alt="EnviroSync Logo"/>
            </section>
            <nav className="sidebar-nav">
                <a href="/dashboard" className="sidebar-link">
                    <DashboardIcon />
                    Dashboard
                </a>
                <a href="/dashboard-test" className="sidebar-link">
                    <DashboardIcon />
                    Test
                </a>
            </nav>
        </aside>
    );
};

export default Sidebar;