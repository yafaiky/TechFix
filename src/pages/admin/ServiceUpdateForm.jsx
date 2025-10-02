import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowBigLeftDash } from "lucide-react";
import api from "../../utils/api";

export default function ServiceUpdateForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    penyebab: "",
    kerusakan: "",
    penyelesaian: "",
    partUsed: "",
    garansi: "",
    serviceStatus: "PROGRESS"
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/api/services/${id}`, form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });   
      alert("Update berhasil");
      navigate(`/services/${id}`);
    } catch (err) {
      alert("Update gagal: " + err.response?.data?.error);
    }
  };

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
      <input name="penyebab" value={form.penyebab} onChange={handleChange} className="border p-2 w-full" />

      <label>Kerusakan:</label>
      <input name="kerusakan" value={form.kerusakan} onChange={handleChange} className="border p-2 w-full" />

      <label>Penyelesaian:</label>
      <input name="penyelesaian" value={form.penyelesaian} onChange={handleChange} className="border p-2 w-full" />

      <label>Part Used:</label>
      <input name="partUsed" value={form.partUsed} onChange={handleChange} className="border p-2 w-full" />

      <label>Garansi:</label>
      <input type="date" name="garansi" value={form.garansi} onChange={handleChange} className="border p-2 w-full" />

      <label>Status:</label>
      <select name="serviceStatus" value={form.serviceStatus} onChange={handleChange} className="border p-2 w-full">
        {/* <option>OPEN</option> */}
        <option>PROGRESS</option>
        <option>SOLVED</option>
        <option>WARRANTY</option>
        <option>DONE</option>
        <option>CANCELLED</option>
      </select>

      <button type="submit" className="bg-green-600 text-white px-4 py-2 mt-4 rounded">
        Simpan
      </button>
    </form>
    </div>

  );
}
