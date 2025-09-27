// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import TechDashboard from "./pages/dashboard/TechDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const { auth, loading } = useAuth();

  if (loading) return <div>Loading app...</div>;

  return (
    <Routes>
      {/* Login page */}
      <Route
        path="/"
        element={
          !auth.token ? (
            <Login />
          ) : auth.role === "ADMIN" ? (
            <Navigate to="/admin" />
          ) : (
            <Navigate to="/technician" />
          )
        }
      />

      {/* Admin Dashboard */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Technician Dashboard */}
      <Route
        path="/technician/*"
        element={
          <ProtectedRoute requiredRole="TECHNICIAN">
            <TechDashboard />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
