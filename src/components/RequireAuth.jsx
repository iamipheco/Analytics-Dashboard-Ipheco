import { Navigate, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";

// Sends signed-out visitors to the login page, remembering where they were headed.
const RequireAuth = ({ children }) => {
    const { session } = useApp();
    const location = useLocation();
    if (!session) return <Navigate to="/login" replace state={{ from: location }} />;
    return children;
};

export default RequireAuth;
