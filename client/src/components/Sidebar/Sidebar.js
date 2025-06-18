import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useSession } from "../../context/SessionProvider";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import MenuIcon from '@mui/icons-material/Menu';
import "./Sidebar.css";

const Sidebar = () => {
    const [menuVisible, setMenuVisible] = useState(false);
    const sidebarRef = useRef(null);
    const { session } = useSession();

    const toggleMenu = () => {
        setMenuVisible((prevVisible) => !prevVisible);
    };

    const handleOutsideClick = (event) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
            setMenuVisible(false);
        }
    };

    useEffect(() => {
        if (menuVisible) {
            document.addEventListener("mousedown", handleOutsideClick);
        } else {
            document.removeEventListener("mousedown", handleOutsideClick);
        }

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [menuVisible]);

    console.log(session.role);
    return (
        <div ref={sidebarRef} className="sidebar-container">
            <aside className="sidebar">
                <section className="logo">
                    <img src="logo.png" alt="EnviroSync Logo"/>
                </section>
                <div className="menu-trigger" onClick={toggleMenu}>
                    <MenuIcon />
                </div>
                <nav className="sidebar-nav desktop-nav">
                    <Link to="/" className="sidebar-link">
                        <DashboardIcon />
                        Dashboard
                    </Link>
                    { session.role === 1 && (
                        <>
                            <Link to="/manage" className="sidebar-link">
                                <DashboardCustomizeIcon />
                                Management
                            </Link>
                        </>
                    )}
                    { session.role === 1 && (
                        <>
                            <Link to="/manage" className="sidebar-link">
                                <DashboardCustomizeIcon />
                                Admin Panel
                            </Link>
                        </>
                    )}
                </nav>
            </aside>
        </div>
    );
};

export default Sidebar;