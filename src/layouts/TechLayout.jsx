// src/layouts/TechLayout.jsx
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function TechLayout() {
    const { logout } = useAuth();

    return (
        <div className="flex h-screen bg-gray-100">
            <aside className="w-64 bg-gray-900 text-white flex flex-col">
                <div className="p-4 text-2xl font-bold text-center border-b border-gray-700">
                    TechFix
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <NavLink
                        to="/technician/overview"
                        className={({ isActive }) =>
                            `block rounded px-3 py-2 ${isActive ? "bg-blue-600" : "hover:bg-gray-700"
                            }`
                        }
                    >
                        Dashboard
                    </NavLink>
                    <NavLink
                        to="/TECHNICIAN/service"
                        className={({ isActive }) =>
                            `block rounded px-3 py-2 ${isActive ? "bg-blue-600" : "hover:bg-gray-700"
                            }`
                        }
                    >
                        Service
                    </NavLink>
                </nav>
            </aside>

            <div className="flex-1 flex flex-col">
                <header className="bg-white shadow p-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold">TECHNICIAN Dashboard</h1>
                    <button
                        onClick={logout}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                        Logout
                    </button>
                </header>

                <main className="p-6 flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
