import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://incrediblesaizan1-ai-developer-backend.vercel.app",
  // baseURL: "http://localhost:3000",
  timeout: 0,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
