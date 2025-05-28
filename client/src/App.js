import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Dashboard from "./components/Dashboard/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import SessionProvider from "./context/SessionProvider";
import Header from "./components/Header/Header"; // Importerer Header-komponenten

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