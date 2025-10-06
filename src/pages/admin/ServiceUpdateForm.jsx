import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowBigLeftDash } from "lucide-react";
import api from "../../utils/api";

export default function ServiceUpdateForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [justSaved, setJustSaved] = useState(false); // ✅ status simpan baru

  // Status yang tidak boleh diupdate lagi
  const FINAL_STATUSES = ["DONE", "WARRANTY", "CANCELLED"];

  // Final hanya berlaku kalau status sudah final & baru saja disimpan
  const isFinal = !!form && FINAL_STATUSES.includes(form.serviceStatus) && justSaved;

  useEffect(() => {
    async function fetchService() {
      try {
        const res = await api.get(`/api/services/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setForm({
          penyebab: res.data.penyebab || "",
          kerusakan: res.data.kerusakan || "",
          penyelesaian: res.data.penyelesaian || "",
          partUsed: res.data.partUsed || "",
          garansi: res.data.garansi ? res.data.garansi.split("T")[0] : "",
          serviceStatus: res.data.serviceStatus,
        });
      } catch (err) {
        alert("Gagal load data service");
        navigate("/admin/overview");
      } finally {
        setLoading(false);
      }
    }
    fetchService();
  }, [id, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (FINAL_STATUSES.includes(form.serviceStatus)) {
      const confirmFinal = window.confirm(
        `Status akan diubah menjadi ${form.serviceStatus}. Setelah ini service tidak bisa diupdate lagi. Lanjutkan?`
      );
      if (!confirmFinal) return;
    }

    try {
      await api.patch(`/api/services/${id}`, form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Update berhasil");
      // Tandai bahwa data baru saja disimpan
      setJustSaved(true);
    } catch (err) {
      alert("Update gagal: " + err.response?.data?.error);
    }
  };

  if (loading || !form) return <p className="p-4">Loading...</p>;

  // 🚫 Jika status final dan sudah tersimpan → form tidak bisa diupdate lagi
  if (isFinal) {
    return (
      <div className="p-6">
        <button
          onClick={() => navigate("/admin/overview")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-800 text-white rounded-lg text-sm font-medium transition"
        >
          <ArrowBigLeftDash size={16} />
          Back
        </button>
        <div className="mt-6 p-6 bg-gray-100 border rounded">
          <h2 className="text-xl font-bold">Service Tidak Bisa Diupdate</h2>
          <p className="mt-2">
            Status service saat ini adalah{" "}
            <span className="font-semibold">{form.serviceStatus}</span>. Data
            sudah final, tidak bisa diubah lagi.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 md:p-6 space-y-5">
      <button
        onClick={() => navigate("/admin/overview")}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-800 text-white rounded-lg text-sm font-medium transition"
      >
        <ArrowBigLeftDash size={16} />
        Back
      </button>

      <form onSubmit={handleSubmit} className="p-6 bg-white shadow-md rounded">
        <h2 className="text-xl font-bold mb-4">Update Service</h2>

        <label>Penyebab:</label>
        <input
          name="penyebab"
          value={form.penyebab}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <label>Kerusakan:</label>
        <input
          name="kerusakan"
          value={form.kerusakan}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <label>Penyelesaian:</label>
        <input
          name="penyelesaian"
          value={form.penyelesaian}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <label>Part Used:</label>
        <input
          name="partUsed"
          value={form.partUsed}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <label>Garansi:</label>
        <input
          type="date"
          name="garansi"
          value={form.garansi}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <label>Status:</label>
        <select
          name="serviceStatus"
          value={form.serviceStatus}
          onChange={handleChange}
          className="border p-2 w-full"
        >
          <option>PROGRESS</option>
          <option>SOLVED</option>
          <option>WARRANTY</option>
          <option>DONE</option>
          <option>CANCELLED</option>
        </select>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 mt-4 rounded"
        >
          Simpan
        </button>
      </form>
    </div>
  );
}
