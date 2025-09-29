// src/layouts/AdminLayout.jsx
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X, LogOut } from "lucide-react";
import Logo from "../assets/logo.png";

export default function AdminLayout() {
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    if (window.confirm("Apakah Ente yakin ingin logout?")) {
      logout();
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 text-white transform 
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="p-4 text-center border-b border-gray-700">
          <img
            src={Logo}
            alt="Logo"
            className="mx-auto h-10 w-auto"
          />
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavLink
            to="/admin/overview"
            className={({ isActive }) =>
              `block rounded px-3 py-2 ${
                isActive ? "bg-blue-600" : "hover:bg-gray-700"
              }`
            }
            onClick={() => setSidebarOpen(false)}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/service"
            className={({ isActive }) =>
              `block rounded px-3 py-2 ${
                isActive ? "bg-blue-600" : "hover:bg-gray-700"
              }`
            }
            onClick={() => setSidebarOpen(false)}
          >
            Service
          </NavLink>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <button
            className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-200"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <h1 className="text-xl font-bold">Admin Dashboard</h1>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700 transition"
          >
            <LogOut size={16} /> Logout
          </button>
        </header>

        <main className="p-6 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
