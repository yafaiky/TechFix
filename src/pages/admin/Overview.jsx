import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import api from "../../utils/api";

export default function OverviewTech() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("All");
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    const filters = ["All", "OPEN", "PROGRESS", "SOLVED", "WARRANTY", "DONE", "CANCELLED"];

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await api.get("api/services");
                setServices(res.data);
            } catch (err) {
                console.error("Gagal fetch services:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    const filteredServices = services.filter((s) => {
        const byStatus = statusFilter === "All" || s.serviceStatus === statusFilter;
        const bySearch = s.customer?.name?.toLowerCase().includes(search.toLowerCase());
        return byStatus && bySearch;
    });

    return (
        <div className="p-4 md:p-6">
            <h1 className="text-xl md:text-2xl font-bold mb-4">Admin Dashboard</h1>

            {/* Filter */}
            <div className="flex flex-wrap gap-2 mb-4">
                {filters.map((f) => (
                    <button
                        key={f}
                        onClick={() => setStatusFilter(f)}
                        className={`px-3 py-1 rounded-lg border text-sm ${statusFilter === f ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
                    }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-1/3 mb-4">

                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />

                {/* Input */}
                <input
                    type="text"
                    placeholder="Cari customer..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full border pl-10 pr-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            </div>

            {/* Content */}
            {loading ? (
                <p>Loading...</p>
            ) : filteredServices.length === 0 ? (
                <p>Tidak ada data service.</p>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredServices.map((s) => (
                        <div
                            key={s.id}
                            className="p-4 border rounded-lg shadow bg-white flex flex-col justify-between"
                        >
                            <div>
                                <p className="text-xs text-blue-800">ID : {s.customer?.memberID}</p>
                                <h2 className="font-semibold text-base md:text-lg">{s.customer?.name}</h2>
                                <p className="text-sm text-gray-500">Status: {s.serviceStatus}</p>
                                <p className="text-sm">Phone : {s.customer?.phone}</p>
                                <p className="text-sm">Email: {s.customer?.email}</p>
                            </div>

                            {/* Pindah ke halaman detail */}
                            <div className="mt-3 flex justify-between items-center">
                                <button
                                    onClick={() => navigate(`/admin/overview/${s.id}`)}
                                    className="px-3 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                                >
                                    Lihat Detail
                                </button>

                                <button
                                    onClick={() => navigate(`/admin/services/update/${s.id}`)}
                                    className="px-3 py-1 text-sm rounded bg-green-600 text-white hover:bg-green-700 transition"
                                >
                                    Update Status
                                </button>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
