import { io } from "socket.io-client"; // Fixed import
import { axiosInstance } from "./axiosInstance";

let socketInstance = null;

export const initializeSocket = async (projectId) => {
  try {
    if (socketInstance) return socketInstance;

    const response = await axiosInstance.get("/profile");
    const token = response.data?.user?.accessToken;

    if (!token) {
      console.error("No token received");
      return null;
    }

    // socketInstance = io("http://localhost:3000", {
    socketInstance = io("https://incrediblesaizan1-ai-developer-backend.vercel.app", {
        auth: { Authorization: `Bearer ${token}` },
        query: { projectId },
        transports: ["websocket", "polling"],
        withCredentials: true,
      }
    );

    socketInstance.on("connect", () => {
      console.log("Connected to Socket.io with ID:", socketInstance.id);
    });

    socketInstance.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    return socketInstance;
  } catch (error) {
    console.error("Error initializing socket:", error);
    return null;
  }
};

export const receiveMessage = (eventName, cb) => {
  socketInstance?.on(eventName, cb);
};

export const sendMessage = (eventName, data) => {
  if (socketInstance) {
    socketInstance.emit(eventName, data);
  } else {
    console.error("Socket not initialized!");
  }
};
