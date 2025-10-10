import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowBigLeftDash } from "lucide-react";
import api from "../../utils/api";

export default function ServiceUpdateForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [justSaved, setJustSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // Status yang tidak boleh diupdate lagi
  const FINAL_STATUSES = ["DONE", "WARRANTY", "CANCELLED"];

  // Ambil data service dari API
  useEffect(() => {
    async function fetchService() {
      try {
        const res = await api.get(`/api/services/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = res.data.service || res.data; // handle kemungkinan nested response

        setForm({
          penyebab: data.penyebab || "",
          kerusakan: data.kerusakan || "",
          penyelesaian: data.penyelesaian || "",
          partUsed: data.partUsed || "",
          garansi: data.garansi ? data.garansi.split("T")[0] : "",
          serviceStatus: data.serviceStatus || "OPEN",
        });
      } catch (err) {
        alert("Gagal memuat data service");
        navigate("/admin/overview");
      } finally {
        setLoading(false);
      }
    }

    fetchService();
  }, [id, navigate]);

  // Handle input
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Handle submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    setSaving(true);

    const payload = { ...form };

    // Ubah otomatis dari OPEN → PROGRESS
    if (payload.serviceStatus === "OPEN") {
      payload.serviceStatus = "PROGRESS";
    }

    // Konfirmasi jika status termasuk final
    if (FINAL_STATUSES.includes(payload.serviceStatus)) {
      const confirmFinal = window.confirm(
        `Status akan diubah menjadi ${payload.serviceStatus}. Setelah ini service tidak bisa diupdate lagi. Lanjutkan?`
      );
      if (!confirmFinal) return;
    }

    try {
      console.log("🛰️ Data yang dikirim:", payload);

      await api.patch(`/api/services/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      alert("Update berhasil ✅");

      // Tandai jika status final
      setJustSaved(FINAL_STATUSES.includes(payload.serviceStatus));

      // Langsung kembali ke dashboard
      navigate("/admin/overview");
    } catch (err) {
      console.error("❌ Gagal update:", err);
      alert("Update gagal: " + (err.response?.data?.error || err.message));
    }
  };

  // Saat loading
  if (loading || !form) return <p className="p-4">Loading...</p>;

  // Form utama
  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 bg-white p-5 rounded-xl shadow-md"
      encType="multipart/form-data"
    >
      <button
        onClick={() => navigate("/admin/overview")}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-800 text-white rounded-lg text-sm font-medium transition"
      >
        <ArrowBigLeftDash size={16} />
        Back
      </button>
      <h2 className="text-xl font-semibold text-gray-800">
        🔧 Update Service
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Penyebab</label>
          <input
            type="text"
            name="penyebab"
            className="w-full border p-2 rounded"
            placeholder="Masukkan penyebab"
            onChange={handleChange}
            value={form.penyebab}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Kerusakan</label>
          <input
            type="text"
            name="kerusakan"
            className="w-full border p-2 rounded"
            placeholder="Masukkan kerusakan"
            onChange={handleChange}
            value={form.kerusakan}
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">
            Penyelesaian
          </label>
          <textarea
            name="penyelesaian"
            rows="3"
            className="w-full border p-2 rounded"
            placeholder="Deskripsi penyelesaian"
            value={form.penyelesaian}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Part Diganti</label>
          <input
            type="text"
            name="partUsed"
            className="w-full border p-2 rounded"
            placeholder="Part yang digunakan"
            value={form.partUsed}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Garansi</label>
          <input
            type="date"
            name="garansi"
            className="w-full border p-2 rounded"
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Status Service
          </label>
          <select
            name="serviceStatus"
            className="w-full border p-2 rounded"
            value={form.serviceStatus}
            onChange={handleChange}
          >
            <option value="OPEN">OPEN</option>
            <option value="PROGRESS">PROGRESS</option>
            <option value="SOLVED">SOLVED</option>
            <option value="WARRANTY">WARRANTY</option>
            <option value="DONE">DONE</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
      </div>

      {/* 📸 Upload Foto */}
      {/* <div>
        <label className="block mb-1 font-medium">Upload Foto (Opsional)</label>
        <div className="flex items-center gap-2 mb-3">
          <label
            htmlFor="file-upload"
            className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
          >
            Pilih Gambar
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
          <span className="text-sm text-gray-500">
            {images.length}/10 gambar dipilih
          </span>
          {images.length > 0 && (
            <button
              type="button"
              onClick={clearAllImages}
              className="text-sm text-red-600 underline ml-2"
            >
              Hapus Semua
            </button>
          )}
        </div>

        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {images.map((file, index) => (
              <div key={index} className="relative group">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`preview-${index}`}
                  className="w-full h-32 object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full px-2 py-0.5 text-xs opacity-80 hover:opacity-100"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div> */}

      <button
        type="submit"
        disabled={saving}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md w-full"
      >
        {saving ? "Menyimpan..." : "Simpan Perubahan"}
      </button>
    </form>
  );
}
