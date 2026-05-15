// reservasiApi.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7275/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const reservasiApi = {
  getById: (id) => api.get(`/reservasi/${id}`),
  getHariIni: () => api.get("/reservasi/hari-ini"),
  create: (reservasi) => api.post("/reservasi", reservasi),
  konfirmasi: (id) => api.put(`/reservasi/${id}/konfirmasi`),
};
