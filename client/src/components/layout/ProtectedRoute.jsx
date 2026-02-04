import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../../context/AuthContext";

const ProtectedRoute = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <div>Loading...</div>; // Or a spinner
    }

    return user ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
