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
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium">Username</label>
                <input value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
                <label className="block text-sm font-medium">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-3 py-2 border rounded" />
            </div>
            <button type="submit" disabled={busy} className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                {busy ? "Loading..." : "Login"}
            </button>
        </form>
    );
}
