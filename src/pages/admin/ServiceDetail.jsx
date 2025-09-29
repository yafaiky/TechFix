import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowBigLeftDash } from "lucide-react";
import api from "../../utils/api";

export default function ServiceDetail() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await api.get(`/api/services/${id}`);
        setService(res.data);
      } catch (err) {
        console.error("Gagal fetch detail:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="p-6 flex justify-center items-center">
        <p className="text-gray-500">Service tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate("/admin/overview")}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-800 text-white rounded-lg text-sm font-medium transition"
      >
        <ArrowBigLeftDash size={16} />
        Back
      </button>

      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-800">Detail Service</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Customer Card */}
        <div className="bg-white shadow-md rounded-xl p-5">
          <h2 className="text-lg font-semibold mb-3 border-b pb-2">Customer</h2>
          <div className="space-y-1 text-sm text-gray-700">
            <p><span className="font-medium text-gray-500">Nama:</span> {service.customer?.name}</p>
            <p><span className="font-medium text-gray-500">Phone:</span> {service.customer?.phone}</p>
            <p><span className="font-medium text-gray-500">Email:</span> {service.customer?.email}</p>
            <p><span className="font-medium text-gray-500">Alamat:</span> {service.customer?.address}</p>
          </div>
        </div>

        {/* Service Card */}
        <div className="bg-white shadow-md rounded-xl p-5">
          <h2 className="text-lg font-semibold mb-3 border-b pb-2">Service Info</h2>
          <div className="space-y-1 text-sm text-gray-700">
            <p><span className="font-medium text-gray-500">Model:</span> {service.Model}</p>
            <p><span className="font-medium text-gray-500">IMEI:</span> {service.IMEI}</p>
            <p><span className="font-medium text-gray-500">Keluhan:</span> {service.Keluhan}</p>
            <p><span className="font-medium text-gray-500">Kondisi:</span> {service.Kondisi}</p>
            <p>
              <span className="font-medium text-gray-500">Status:</span>{" "}
              <span
                className={`px-2 py-1 rounded-md text-xs font-semibold ${
                  service.serviceStatus === "DONE"
                    ? "bg-green-100 text-green-700"
                    : service.serviceStatus === "PROGRESS"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {service.serviceStatus}
              </span>
            </p>
            <p>
              <span className="font-medium text-gray-500">Dibuat:</span>{" "}
              {new Date(service.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Media Section */}
      {service.media?.length > 0 && (
        <div className="bg-white shadow-md rounded-xl p-5">
          <h2 className="text-lg font-semibold mb-3 border-b pb-2">Media</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {service.media.map((m) => (
              <div
                key={m.id}
                className="border rounded-lg p-3 bg-gray-50 text-sm space-y-3"
              >
                {/* Signature */}
                <div>
                  <p className="font-medium text-gray-500">Tanda Tangan :</p>
                  {m.signature ? (
                    <img
                      src={`http://localhost:5000/uploads/${m.signature}`}
                      alt="Signature"
                      className="w-full max-h-64 border rounded"
                    />
                  ) : (
                    <p>-</p>
                  )}
                </div>

                {/* Dokumentasi */}
                <div>
                  <p className="font-medium text-gray-500">Dokumentasi :</p>
                  {m.dokumentasi && m.dokumentasi.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {m.dokumentasi.map((dok, plus) => (
                        <img
                          key={plus}
                          src={`http://localhost:5000/uploads/${dok}`}
                          alt={`Dokumentasi ${plus + 1}`}
                          className="w-40 h-40 object-contain-cover border rounded"
                        />
                      ))}
                    </div>
                  ) : (
                    <p>-</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
