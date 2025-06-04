import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import SessionProvider, { useSession } from "./context/SessionProvider";

import { AlertProvider } from "./context/AlertContext";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar"
import ProfileDashboard from "./components/ProfileDashboard/ProfileDashboard";

function App() {
    const AppContent = () => {
        const session = useSession();

        if(session.session?.id) {
            return (
                <>
                    <AlertProvider>
                        <Sidebar />
                        <main>
                            <Header />
                            <section className="dashboard-container">
                                <Routes>
                                    <Route path="/dashboard" element={<ProtectedRoute element={<h1>Dashboard 1</h1>} />} />
                                    <Route path="/dashboard-test" element={<ProtectedRoute element={<h1>Dashboard 2</h1>} />} />
                                    <Route path="/profile" element={<ProtectedRoute element={<ProfileDashboard />} />} />
                                </Routes>
                            </section>

                        </main>
                    </AlertProvider>
                </>
            );
        }

        return (
            <>
                <AlertProvider>
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/dashboard" element={<ProtectedRoute />} />
                        <Route path="/dashboard-test" element={<ProtectedRoute />} />
                        <Route path="/profile" element={<ProtectedRoute />} />
                    </Routes>
                </AlertProvider>
            </>
        );
    };

    return (
        <SessionProvider>
            <Router>
                <AppContent />
            </Router>
        </SessionProvider>
    );
}

export default App;