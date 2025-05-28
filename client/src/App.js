import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import SessionProvider, { useSession } from "./context/SessionProvider";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar"

function App() {
    const AppContent = () => {
        const session = useSession(); // Henter session ved hjælp af hook

        if(session.session?.id) {
            return (
                <>
                    <Sidebar />
                    <main>
                        <Header />
                        <section className="dashboard-container">
                            <Routes>
                                <Route path="/dashboard" element={<ProtectedRoute element={<h1>Dashboard 1</h1>} />} />
                                <Route path="/dashboard-test" element={<ProtectedRoute element={<h1>Dashboard 2</h1>} />} />
                            </Routes>
                        </section>

                    </main>
                </>
            );
        }

        return (
            <>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<ProtectedRoute />} />
                </Routes>
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