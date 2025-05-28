import React from "react";
import { Navigate } from "react-router-dom";
import { useSession } from "../../context/SessionProvider";

const ProtectedRoute = ({ element }) => {
    const { session } = useSession();

    if (!session) {
        return <Navigate to="/login" />;
    }

    return element;
};

export default ProtectedRoute;