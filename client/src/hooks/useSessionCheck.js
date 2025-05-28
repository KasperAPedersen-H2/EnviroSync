import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../context/SessionProvider";

const useSessionCheck = () => {
    const { session } = useSession();
    const navigate = useNavigate();

    useEffect(() => {
        if (!session) {
            navigate("/login");
        }
    }, [session, navigate]);

    return session; // Returnér session, hvis nødvendigt
};

export default useSessionCheck;