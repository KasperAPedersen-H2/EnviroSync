import React from "react";
import { Link } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard"; // Importer Dashboard-ikonet
import "./Sidebar.css"; // Import af CSS-fil

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <section className="logo">
                <img src="logo.png" alt="EnviroSync Logo"/>
            </section>
            <nav className="sidebar-nav">
                <Link to="/" className="sidebar-link">
                    <DashboardIcon />
                    Dashboard
                </Link>
                <Link to="/dashboard-test" className="sidebar-link">
                    <DashboardIcon />
                    Test
                </Link>
            </nav>
        </aside>
    );
};

export default Sidebar;
