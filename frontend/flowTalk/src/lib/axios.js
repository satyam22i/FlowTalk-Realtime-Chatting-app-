import axios from "axios";


export const axiosInstance = axios.create({
  baseURL: "https://flowtalk-3.onrender.com/api",
  withCredentials: true,
})
