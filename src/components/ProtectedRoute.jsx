import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, requiredRole = null }) {
    const { auth, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    if (!auth?.token) {
        return <Navigate to="/" replace />;
    }

    if (requiredRole && auth.role !== requiredRole) {
        // jika role tidak cocok, bisa redirect ke unauthorized atau dashboard
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}
