import React, { useState, useEffect, useRef } from "react";
import { AccountCircle, Settings, Logout } from "@mui/icons-material";
import "./Dropdown.css";

const Dropdown = ({ username }) => {
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
            <img src="img_avatar3.png" alt="Avatar icon" className="dropdown-trigger" onClick={toggleDropdown}/>
            <div className={`dropdown-menu ${dropdownVisible ? "visible" : ""}`}>
                <h3>Welcome, {username}</h3>
                <nav>
                    <a href="#">
                        <AccountCircle />
                        Account
                    </a>
                    <a href="#">
                        <Settings />
                        Settings
                    </a>
                    <a href="#" onClick={handleLogout}>
                        <Logout />
                        Logout
                    </a>
                </nav>
            </div>
        </div>
    );
};

export default Dropdown;