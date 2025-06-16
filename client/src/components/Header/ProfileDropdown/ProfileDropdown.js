import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { AccountCircle, Settings, Logout } from "@mui/icons-material";
import "./ProfileDropdown.css";

const ProfileDropdown = ({ username, avatarData }) => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const dropdownRef = useRef(null);

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

export default ProfileDropdown;
