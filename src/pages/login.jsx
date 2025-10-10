import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png"; // ganti path sesuai lokasi logo kamu

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (username, password) => {
    await login(username, password);
    navigate("/dashboard");
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-800 via-blue-700 relative overflow-hidden">
      {/* efek cahaya latar belakang */}
      <div className="absolute w-[600px] h-[600px] bg-blue-400/30 rounded-full blur-3xl top-[-200px] left-[-200px]" />
      <div className="absolute w-[500px] h-[500px] bg-cyan-400/20 rounded-full blur-3xl bottom-[-150px] right-[-150px]" />

      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-3xl p-8 animate-fadeIn">
        <div className="flex flex-col items-center mb-6">
          <img
            src={logo}
            alt="Logo"
            className="w-20 h-20 mb-3 drop-shadow-xl"
          />
          <h1 className="text-3xl font-extrabold text-white tracking-wide">
            Welcome Back
          </h1>
          <p className="text-blue-100 text-sm mt-1">
            Silakan login untuk masuk ke sistem
          </p>
        </div>

        <LoginForm onLogin={handleLogin} />
      </div>
    </div>
  );
}
