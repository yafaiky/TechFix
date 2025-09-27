import { useState } from "react";
import api from "../../utils/api";

export default function CustomerForm({ onCreated }) {
    const [form, setForm] = useState({
        name: "",
        phone: "",
        email: "",
        address: "",
    });

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/api/customers", form);
            console.log("✅ Customer created:", res.data);
            // simpan customer.id untuk step 2 (service)    
            onCreated(res.data.id);
        } catch (err) {
            console.error("❌ Gagal membuat customer:", err.response?.data || err.message);
            alert("Gagal membuat customer: " + (err.response?.data?.error || err.message));
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 bg-white p-4 rounded shadow"
        >
            <h2 className="text-xl font-semibold">Step 1: Data Customer</h2>

            <input
                type="text"
                name="name"
                placeholder="Nama Customer"
                className="w-full border p-2 rounded"
                required
                onChange={handleChange}
            />

            <input
                type="tel"
                name="phone"
                placeholder="No HP"
                className="w-full border p-2 rounded"
                required
                onChange={handleChange}
            />

            <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full border p-2 rounded"
                required
                onChange={handleChange}
            />

            <textarea
                name="address"
                placeholder="Alamat"
                className="w-full border p-2 rounded"
                required
                onChange={handleChange}
            />

            <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
                Lanjut ke Service
            </button>
        </form>
    );
}
