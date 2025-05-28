import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../../context/SessionProvider";
import { jwtDecode } from "jwt-decode";
import "./Login.css"; // Import CSS-fil

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { setSession } = useSession();
    const navigate = useNavigate();

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
                alert("Login failed! Check your credentials.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <section className="login-container">
            <article className="card">
                <h2 className="login-title">Login</h2>
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
                <p className="register-link" >Don't have an account? <a href="/register">Sign up</a></p>
            </article>
        </section>
    );
};

export default Login;