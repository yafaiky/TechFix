// src/pages/Dashboard.jsx
import { useAuth } from "../../context/AuthContext";
import AdminDashboard from "./AdminDashboard";
import TechDashboard from "./TechDashboard";

export default function Dashboard() {
    const { auth } = useAuth();

    if (!auth?.role) return <div>Loading role...</div>;

    return <div>{auth.role === "ADMIN" ? <AdminDashboard /> : <TechDashboard />}</div>;
}
