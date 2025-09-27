import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import Overview from "../admin/Overview";
import Detail from "../admin/ServiceDetail";
import ServicePage from "../admin/ServicePage"

export default function AdminDashboard() {
    return (
        <Routes>
            <Route path="/" element={<AdminLayout />}>
                <Route index element={<Navigate to="overview" replace />} />

                <Route path="overview" element={<Overview />} />
                <Route path="overview/:id" element={<Detail />} />
                <Route path="service" element={<ServicePage />} />

                <Route path="*" element={<Navigate to="overview" replace />} />
            </Route>
        </Routes>
    );
}
