// services/api.ts
import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9898";

const api = axios.create({
  baseURL: API,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
