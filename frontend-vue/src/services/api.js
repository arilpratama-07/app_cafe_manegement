import axios from "axios";

// HANYA ada satu export 'api' di sini
export const api = axios.create({
  baseURL: "http://localhost:5000", // Pastikan port sesuai dengan backend Anda
});
