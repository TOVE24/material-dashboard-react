import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const tenantId = localStorage.getItem("tenantId"); // Obtenemos el tenantId guardado

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (tenantId) {
    config.headers["X-Tenant-ID"] = tenantId; // Lo enviamos en todas las peticiones
  }

  return config;
});

export default api;
