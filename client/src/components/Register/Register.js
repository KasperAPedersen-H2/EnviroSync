import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAlert } from "../../context/AlertContext";
import "./Register.css"; // Import af CSS-fil

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const navigate = useNavigate();
    const { showAlert } = useAlert();

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://${window.location.hostname}:5000/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password, passwordConfirm }),
            });

            if (response.ok) {
                navigate("/login");
            } else {
                showAlert("error", "Registrering fejlede! Prøv igen.");
            }
        } catch (error) {
            console.error("Fejl:", error);
        }
    };

    return (
        <section className="register-container">
            <article className="card">
                <img src="logo.png" alt="EnviroSync Logo"/>
                <form onSubmit={handleRegister} className="register-form">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="register-input"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="register-input"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="register-input"
                        required
                    />
                    <input
                        type="password"
                        placeholder="confirm password"
                        value={passwordConfirm}Add commentMore actions
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        className="register-input"
                        required
                    />
                    <button type="submit" className="register-button">Register</button>
                </form>
                <p className="login-link">Already have an account? <Link to="/login">Login</Link></p>
            </article>
        </section>
    );
};

export default Register;