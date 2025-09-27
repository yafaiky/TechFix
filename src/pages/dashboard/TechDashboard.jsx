// src/pages/dashboard/TechDashboard.jsx
import { Routes, Route } from "react-router-dom";
import TechLayout from "../../layouts/TechLayout";
import Overview from "../TECHNICIAN/Overview";
import Service from "../TECHNICIAN/Service";

export default function TechDashboard() {
    return (
        <Routes>
            <Route path="/" element={<TechLayout />}>
                <Route path="overview" element={<Overview />} />
                <Route path="service" element={<Service />} />
            </Route>
        </Routes>
    );
}
