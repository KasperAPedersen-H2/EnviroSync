import React from "react";
import "./Header.css"; // Importerer styling

const Header = () => {
    return (
        <header className="header">
            <div className="header-container">
                <h1 className="header-title">My Application</h1>
                <nav className="header-nav">
                    <ul className="header-menu">
                        <li>
                            <a href="/" className="header-link">Home</a>
                        </li>
                        <li>
                            <a href="/login" className="header-link">Login</a>
                        </li>
                        <li>
                            <a href="/register" className="header-link">Register</a>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;