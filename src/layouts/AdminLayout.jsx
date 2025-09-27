// src/layouts/AdminLayout.jsx
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../assets/logo.png";

export default function AdminLayout() {
    const { logout } = useAuth();

    return (
        <div className="flex h-screen bg-gray-100">
            <aside className="w-64 bg-gray-900 text-white flex flex-col">
                <div className="p-4 text-center border-b border-gray-700">
                    <img
                        src={Logo}
                        alt="AdminLTE Logo"
                        className="mx-auto h-10 w-auto"
                    />
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <NavLink
                        to="/admin/overview"
                        className={({ isActive }) =>
                            `block rounded px-3 py-2 ${isActive ? "bg-blue-600" : "hover:bg-gray-700"
                            }`
                        }
                    >
                        Dashboard
                    </NavLink>
                    <NavLink
                        to="/admin/service"
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
                    <h1 className="text-xl font-bold">Admin Dashboard</h1>
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
