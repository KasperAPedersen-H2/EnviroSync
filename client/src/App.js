import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

import SessionProvider, { useSession } from "./context/SessionProvider";
import RoomDeviceProvider from "./context/RoomDeviceContext";
import { AlertProvider } from "./context/AlertContext";

import { AvatarProvider } from "./context/AvatarContext";

import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar"
import ProfileDashboard from "./components/ProfileDashboard/ProfileDashboard";
import MainDashboard from "./components/MainDashboard/MainDashboard";
import SettingsDashboard from "./components/SettingsDashboard/SettingsDashboard";

function App() {
    const AppContent = () => {
        const session = useSession();

        if(session.session?.id) {
            return (
                <>
                    <RoomDeviceProvider>
                        <AvatarProvider>
                            <Sidebar />
                            <main>
                                <Header />
                                <section className="dashboard-container">
                                    <Routes>
                                        <Route path="/" element={<ProtectedRoute element={<MainDashboard />} />} />
                                        <Route path="/profile" element={<ProtectedRoute element={<ProfileDashboard />} />} />
                                        <Route path="/settings" element={<ProtectedRoute element={<SettingsDashboard />} />} />
                                        <Route path="/dashboard-test" element={<ProtectedRoute element={<h1>Dashboard 2</h1>} />} />
                                    </Routes>
                                </section>
                            </main>
                        </AvatarProvider>
                    </RoomDeviceProvider>
                </>
            );
        }
        return (
            <>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route path="/profile" element={<ProtectedRoute />} />
                    <Route path="/dashboard-test" element={<ProtectedRoute />} />

                </Routes>
            </>
        );
    };
    return (
        <SessionProvider>
            <Router>
                <AlertProvider>
                    <AppContent />
                </AlertProvider>
            </Router>
        </SessionProvider>
    );
}

export default App;