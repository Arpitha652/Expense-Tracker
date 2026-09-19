import axios from "axios";

const API_BASE_URL = "https://expense-tracker-production-9630.up.railway.app";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;
