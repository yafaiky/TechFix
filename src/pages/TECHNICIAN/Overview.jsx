// src/pages/TECHNICIAN/Overview.jsx
import { useEffect, useState } from "react";
import api from "../../utils/api"; // axios instance

export default function OverviewTech() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");

  // status yang bisa difilter
  const filters = ["All", "Open", "In Progress", "Solving", "Urgency", "Done", "Cancel"];

  // ambil data service dari API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get("/services"); // ganti sesuai endpoint BE kamu
        // cek struktur response dari backend
        // kalau backend return { data: [...] } → pakai res.data.data
        setServices(res.data);
      } catch (err) {
        console.error("Gagal fetch services:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // filter dan search
  const filteredServices = services.filter((s) => {
    const byStatus = statusFilter === "All" || s.status === statusFilter;
    const bySearch = s.customer?.toLowerCase().includes(search.toLowerCase());
    return byStatus && bySearch;
  });

  return (
    <div className="p-6">
      {/* Judul */}
      <h1 className="text-2xl font-bold mb-4">Technician Dashboard</h1>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-2 mb-4">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setStatusFilter(f)}
            className={`px-3 py-1 rounded-lg border ${statusFilter === f
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
              }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Cari customer..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-3 py-2 rounded-lg mb-4 w-full md:w-1/3"
      />

      {/* Content area */}
      {loading ? (
        <p>Loading...</p>
      ) : filteredServices.length === 0 ? (
        <p>Tidak ada data service.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredServices.map((s) => (
            <div
              key={s.id}
              className="p-4 border rounded-lg shadow hover:shadow-md transition cursor-pointer bg-white"
            >
              <h2 className="font-semibold">{s.customer}</h2>
              <p className="text-sm text-gray-500">Status: {s.status}</p>
              <p className="text-sm">Tanggal: {s.date}</p>
              <p className="text-sm line-clamp-2">{s.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
