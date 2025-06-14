import React from "react";
import { Link } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import "./Sidebar.css";

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <section className="logo">
                <img src="logo.png" alt="EnviroSync Logo"/>
            </section>
            <nav className="sidebar-nav">
                <Link to="/" className="sidebar-link">
                    <DashboardIcon
                    />
                    Dashboard
                </Link>
                <Link to="/manage" className="sidebar-link">
                    <DashboardCustomizeIcon
                    />
                    Management
                </Link>
            </nav>
        </aside>
    );
};

export default Sidebar;
