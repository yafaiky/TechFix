import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SignatureCanvas from "react-signature-canvas";
import toast from "react-hot-toast";
import api from "../../utils/api";

export default function ServiceForm({ customerId }) {
  const [form, setForm] = useState({
    Model: "",
    IMEI: "",
    Keluhan: "",
    Kondisi: "",
  });
  const [images, setImages] = useState([]);
  const sigCanvas = useRef(null);
  const navigate = useNavigate();

  const base64ToBlob = (base64, mime) => {  
    const byteString = atob(base64.split(",")[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mime });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    let newImages = [...images, ...files];
    if (newImages.length > 10) {
      toast.error("Maksimal 10 gambar!");
      newImages = newImages.slice(0, 10);
    }
    setImages(newImages);
  };

  const handleRemove = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const clearSignature = () => {
    sigCanvas.current.clear();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // STEP 1: Buat service
      const serviceRes = await api.post("/api/services/admin", {
        ...form,
        customerId,
      });

      if (!serviceRes.data.id) {
        toast.error("Response service tidak valid");
        return;
      }

      const serviceId = serviceRes.data.id;

      // STEP 2: Upload media (jika ada)
      const formData = new FormData();
      formData.append("serviceId", serviceId);

      images.forEach((file) => {
        formData.append("dokumentasi", file);
      });

      if (!sigCanvas.current.isEmpty()) {
        const signatureData = sigCanvas.current
          .getCanvas()
          .toDataURL("image/png");
        const blob = base64ToBlob(signatureData, "image/png");
        formData.append("signature", blob, "signature.png");
      }

      if (images.length > 0 || !sigCanvas.current.isEmpty()) {
        await api.post("/api/media/admin", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Media berhasil diupload!");
      }

      // STEP 3: Notifikasi sukses
      alert("Service berhasil dibuat!");

      try {
        await api.post("/api/pdf/send", {
          serviceId,
          type: "CREATE", // atau "UPDATE" / "INVOICE" sesuai kebutuhan
        });
        alert("PDF berhasil dibuat & dikirim ke WhatsApp!");
      } catch (err) {
        alert("Gagal generate PDF: " + (err.response?.data?.error || err.message));
      }

      // redirect ke dashboard admin
      navigate("/admin/overview", { replace: true });

    } catch (err) {
      alert(
        "Gagal membuat service: " +
          (err.response?.data?.error || err.message)
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-4 rounded shadow"
      encType="multipart/form-data"
    >
      <h2 className="text-xl font-semibold">Step 2: Data Service</h2>

      <input
        type="text"
        required
        name="Model"
        placeholder="Model HP"
        className="w-full border p-2 rounded"
        onChange={handleChange}
      />

      <input
        type="text"
        required
        name="IMEI"
        placeholder="IMEI"
        className="w-full border p-2 rounded"
        onChange={handleChange}
      />

      <input
        type="text"
        required
        name="Keluhan"
        placeholder="Keluhan"
        className="w-full border p-2 rounded"
        onChange={handleChange}
      />

      <textarea
        required
        name="Kondisi"
        placeholder="Kondisi"
        className="w-full border p-2 rounded"
        onChange={handleChange}
      />

      {/* Upload Gambar */}
      <div>
        <label className="block mb-1 font-medium">Upload Foto</label>
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
        </div>

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
      </div>

      {/* Tanda Tangan */}
      <div>
        <label className="block mb-1 font-medium">Tanda Tangan</label>
        <SignatureCanvas
          ref={sigCanvas}
          penColor="black"
          canvasProps={{
            width: 400,
            height: 150,
            className: "border rounded",
          }}
        />
        <button
          type="button"
          onClick={clearSignature}
          className="mt-2 bg-gray-400 text-white px-2 py-1 rounded"
        >
          Clear
        </button>
      </div>

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Simpan Service
      </button>
    </form>
  );
}
