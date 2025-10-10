// src/utils/api.js
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
  // withCredentials: true, // uncomment kalau server menggunakan cookie httpOnly
});

// Request interceptor: attach token if ada
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Response interceptor: jika 401, logout langsung (simple)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // clear local storage and force redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("user");
      // sederhana: redirect
      window.location.href = "/";
    }
    return Promise.reject(err);
  }
);

export default api;

// export const getServices = async ({ status, search } = {}) => {
//   const res = await api.get("/api/services", { params: { status, search } });
//   return res.data;
// };

// export const getServiceById = async (id) => {
//   const res = await api.get(`/api/services/${id}`);
//   return res.data;
// };

// export const createServiceByAdmin = async (payload) => {
//   const res = await api.post("/api/services/admin", payload);
//   return res.data;
// };

// export const updateServiceByTechnician = async (id, payload) => {
//   const res = await api.patch(`/api/services/technician/${id}`, payload);
//   return res.data;
// };
