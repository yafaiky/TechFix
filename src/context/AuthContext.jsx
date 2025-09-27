// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [auth, setAuth] = useState({ token: null, role: null, user: null });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // saat mount, load dari localStorage jika ada
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        const user = localStorage.getItem("user");
        if (token) {
            setAuth({
                token,
                role: role || null,
                user: user ? JSON.parse(user) : null,
            });
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        // panggil BE login
        const res = await api.post("/api/users/login", { username, password });
        // ekspektasi: { token, role, user }
        const data = res.data;
        // simpan ke localStorage (bisa ganti ke cookie httpOnly nanti)
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);
        localStorage.setItem("user", JSON.stringify(data.user || null));

        setAuth({ token: res.data.token, role: res.data.role, user: res.data.user || null });
        return data;
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("user");
        setAuth({ token: null, role: null, user: null });
    };

    return (
        <AuthContext.Provider value={{ auth, setAuth, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
