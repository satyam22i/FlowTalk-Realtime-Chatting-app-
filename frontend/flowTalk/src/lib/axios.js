import axios from "axios";


export const axiosInstance = axios.create({
  baseURL: "https://flow-talk-realtime-chatting-app-h72.vercel.app/api",
  withCredentials: true,
})
