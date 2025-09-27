// src/pages/Login.jsx
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (username, password) => {
        await login(username, password);
        // setelah sukses, arahkan ke dashboard
        navigate("/dashboard");
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gray-100 rounded-2xl">
            <div className="w-full max-w-md bg-white p-6 rounded shadow">
                <h1 className="cursor-pointer text-center text-2xl font-bold mb-4">Login</h1>
                <LoginForm onLogin={handleLogin} />
            </div>
        </div>
    );
}
