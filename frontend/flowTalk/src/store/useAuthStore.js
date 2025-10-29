import { create } from 'zustand'
import { axiosInstance } from "../lib/axios.js"
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';
const BASE_URL = "https://flowtalkkkk.onrender.com"


const useAuthStore = create((set, get) => ({
  authUser: null,

  isSigningUp: false,
  isLoggingIn: false, 
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      
      const res = await axiosInstance.get("/auth/cheak"); 
      set({ authUser: res.data });
      get().connectSocket();

    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true })
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully"); 
      get().connectSocket();

    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      get().disconnectSocket();
      set({ authUser: null });
      toast.success("Logged out successfully"); 

    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/signin", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
      get().connectSocket();

    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
  
      const res = await axiosInstance.put("/auth/update-profile", data);


      set({ authUser: res.data.user }); 
      
      toast.success("Profile updated successfully"); // Corrected spelling

    } catch (error) {
      toast.error(error.response?.data?.message || "Error uploading profile");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser, socket: currentSocket } = get();
    // Check if user exists and if socket isn't already connected
    if (!authUser || currentSocket?.connected) return; 

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id
      }
    });

    socket.connect();

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });

    set({ socket: socket });
  },


  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, onlineUsers: [] });
    }
  }

}));

export default useAuthStore;
