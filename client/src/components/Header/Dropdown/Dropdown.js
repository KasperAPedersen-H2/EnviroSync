import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { AccountCircle, Settings, Logout } from "@mui/icons-material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import "./Dropdown.css";

const Dropdown = ({ username, avatarData }) => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const dropdownRef = useRef(null);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const toggleDropdown = () => {
        setDropdownVisible((prevVisible) => !prevVisible);
    };

    const handleOutsideClick = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownVisible(false);
        }
    };

    const getAvatarSource = () => {
        if(avatarData) {
            return `data:image/png;base64,${avatarData}`;
        }
        return "img_avatar3.png";
    }

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (dropdownVisible) {
            document.addEventListener("mousedown", handleOutsideClick);
        } else {
            document.removeEventListener("mousedown", handleOutsideClick);
        }

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [dropdownVisible]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    return (
        <div ref={dropdownRef} className="dropdown">
            <img src={getAvatarSource()} alt="Avatar icon" className="dropdown-trigger" onClick={toggleDropdown}/>
            <div className={`dropdown-menu ${dropdownVisible ? "visible" : ""}`}>
                <h3>Welcome, {username}</h3>
                <nav>
                    { windowWidth <= 768 && (
                        <>
                            <Link to="/" className="sidebar-link">
                                <DashboardIcon />
                                Dashboard
                            </Link>
                            <Link to="/manage" className="sidebar-link">
                                <DashboardCustomizeIcon />
                                Management
                            </Link>
                        </>
                    )}

                    <Link to="/profile">
                        <AccountCircle />
                        Account
                    </Link>

                    <Link to="/settings">
                        <Settings />
                        Settings
                    </Link>

                    <Link to="#" onClick={handleLogout}>
                        <Logout />
                        Logout
                    </Link>
                </nav>
            </div>
        </div>
    );
};

export default Dropdown;
