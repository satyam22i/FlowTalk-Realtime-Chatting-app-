import axios from "axios";


export const axiosInstance = axios.create({
  baseURL: "https://flow-talk-realtime-chatting-app-826.vercel.app/api",
  withCredentials: true,
})
