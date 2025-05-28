import React, { useState, useEffect, useRef } from "react";
import { AccountCircle, Settings, Logout } from "@mui/icons-material"; // Importer MUI-ikoner
import "./Dropdown.css";

const Dropdown = ({ username }) => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const dropdownRef = useRef(null); // Reference til dropdown-menuen

    // Funktion til at åbne/lukke dropdown via klik
    const toggleDropdown = () => {
        setDropdownVisible((prevVisible) => !prevVisible);
    };

    // Funktion til at lukke dropdown ved klik udenfor
    const handleOutsideClick = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownVisible(false);
        }
    };

    // Registrer/meld fra på event listener for klik
    useEffect(() => {
        if (dropdownVisible) {
            document.addEventListener("mousedown", handleOutsideClick);
        } else {
            document.removeEventListener("mousedown", handleOutsideClick);
        }

        // Rens op ved unmount
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [dropdownVisible]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login"; // Navigér væk
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