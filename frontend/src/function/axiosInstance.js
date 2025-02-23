import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://incrediblesaizan1-ai-developer-backend.vercel.app",
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
