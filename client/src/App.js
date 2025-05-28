import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import SessionProvider from "./components/SessionProvider";

function App() {
    return (
        <SessionProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
                </Routes>
            </Router>
        </SessionProvider>
    );
}

export default App;