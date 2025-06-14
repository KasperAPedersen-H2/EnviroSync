import React, { useEffect, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

import SessionProvider, { useSession } from "./context/SessionProvider";
import RoomDeviceProvider from "./context/RoomDeviceContext";
import { AlertProvider } from "./context/AlertContext";
import DataLimitProvider from "./context/DataLimitContext";
import { AvatarProvider } from "./context/AvatarContext";

import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import ProfileDashboard from "./components/ProfileDashboard/ProfileDashboard";
import MainDashboard from "./components/MainDashboard/MainDashboard";
import SettingsDashboard from "./components/SettingsDashboard/SettingsDashboard";
import ManagementDashboard from "./components/ManagementDashboard/ManagementDashboard";

function App() {
    const [darkMode, setDarkMode] = useState(false);

    const theme = createTheme({
        palette: {
            mode: darkMode ? "dark" : "light",
        },
    });

    useEffect(() => {
        if (darkMode) {
            document.documentElement.setAttribute("data-theme", "dark");
        } else {
            document.documentElement.setAttribute("data-theme", "light");
        }
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode((prevMode) => !prevMode);
    };

    const AppContent = () => {
        const session = useSession();

        if (session.session?.id) {
            return (
                <>
                    <RoomDeviceProvider>
                        <DataLimitProvider>
                            <AvatarProvider>
                                <Sidebar />
                                <main>
                                    <Header />
                                    <section className="dashboard-container">
                                        <Routes>
                                            <Route path="/" element={<ProtectedRoute element={<MainDashboard />} />} />
                                            <Route path="/profile" element={<ProtectedRoute element={<ProfileDashboard />} />} />
                                            <Route path="/settings" element={<ProtectedRoute element={<SettingsDashboard darkMode={darkMode} onDarkModeToggle={toggleDarkMode} />} />} />
                                            <Route path="/manage" element={<ProtectedRoute element={<ManagementDashboard />} />} />
                                        </Routes>
                                    </section>
                                </main>
                            </AvatarProvider>
                        </DataLimitProvider>
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
                    <Route path="/settings" element={<ProtectedRoute />} />
                    <Route path="/manage" element={<ProtectedRoute />} />
                </Routes>
            </>
        );
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <SessionProvider>
                <Router>
                    <AlertProvider>
                        <AppContent />
                    </AlertProvider>
                </Router>
            </SessionProvider>
        </ThemeProvider>
    );
}

export default App;