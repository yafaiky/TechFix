import { useState } from "react";

export default function LoginForm({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await onLogin(username, password);
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Login gagal");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-blue-100 mb-1">
          Username
        </label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full px-4 py-2 rounded-xl bg-white/20 border border-white/30 text-white placeholder-blue-100/60 focus:outline-none focus:ring-2 focus:ring-cyan-300 transition duration-300"
          placeholder="Masukkan username"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-blue-100 mb-1">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 rounded-xl bg-white/20 border border-white/30 text-white placeholder-blue-100/60 focus:outline-none focus:ring-2 focus:ring-cyan-300 transition duration-300"
          placeholder="Masukkan password"
        />
      </div>

      <button
        type="submit"
        disabled={busy}
        className={`w-full py-2 rounded-xl text-white font-semibold transition duration-300 shadow-lg ${
          busy
            ? "bg-blue-400 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-500 to-cyan-400 hover:shadow-cyan-300/30 hover:scale-[1.02]"
        }`}
      >
        {busy ? "Memproses..." : "Masuk"}
      </button>
    </form>
  );
}
