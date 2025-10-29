import { create } from 'zustand'
import { axiosInstance } from "../lib/axios.js"
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';
const BASE_URL = "https://flowtalkkkk.onrender.com"


const useAuthStore = create((set, get) => ({
  authUser: null,

  isSigningUp: false,
  isLogginIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,


  isCheckingAuth: true,

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
      toast.success("Account created Successfully")
      get().connectSocket()

    } catch (error) {
      toast.error(error.response?.data?.message);

    } finally {
      set({ isSigningUp: false })
    }

  },

  logout: async () => {

    try {

      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged Out Successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message);

    }
  },

  login: async (data) => {
    set({ isLogginIn: true });
    try {
      const res = await axiosInstance.post("/auth/signin", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully")
      get().connectSocket()



    } catch (error) {



      toast.error(error.response?.data?.message || "Login failed");


    } finally {
      set({ isLogginIn: false })
    }

  },

  updateProfile: async (data) => {

    set({ isUpdatingProfile: true })

    try {

      const res = axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data })
      toast.success("Profile updated succesfully")
    } catch (error) {
      toast.error(error.response?.data?.message || "err to uploading profile")

    } finally {
      set({ isUpdatingProfile: false })
    }

  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;
    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id
      }
    });

    socket.connect();

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds })
    })


    set({ socket: socket })
  },
  disconnectSocket: () => {
    if (!authUser || get().socket?.connected) return;

  }

}));



export default useAuthStore;
