import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://incrediblesaizan1-ai-developer-backend.vercel.app",
  timeout: 0,
  withCredentials:true,
  headers: {
    "Content-Type": "application/json",
    "accesstoken": localStorage.getItem("accesstoken")
  },
});

