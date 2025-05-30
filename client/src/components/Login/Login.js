import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSession } from "../../context/SessionProvider";
import { jwtDecode } from "jwt-decode";
import {useAlert} from "../../context/AlertContext";
import "./Login.css"; // Import CSS-fil

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { setSession } = useSession();
    const navigate = useNavigate();
    const { showAlert } = useAlert();


    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("token", data.token); // Gem token i localStorage
                setSession(jwtDecode(data.token)); // Dekod token og opdater session
                navigate("/dashboard");
            } else {
                showAlert("error", "Login failed!");

                document.querySelectorAll(".login-input").forEach((element) => element.classList.add("login-error"));
                document.querySelector(".login-input").focus();
                setPassword("");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    document.querySelectorAll(".login-input").forEach((element) => element.addEventListener("change", (e) => {
        e.target.classList.remove("login-error");
    }));

    return (
        <section className="login-container">
            <article className="card">
                <img src="logo.png" alt="EnviroSync Logo"/>
                <form onSubmit={handleLogin} className="login-form">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="login-input"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="login-input"
                        required
                    />
                    <button type="submit" className="login-button">Login</button>
                </form>
                <p className="register-link" >Don't have an account? <Link to="/register">Sign up</Link></p>
            </article>
        </section>
    );
};

export default Login;