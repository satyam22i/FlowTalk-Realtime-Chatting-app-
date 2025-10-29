import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.routes.js";
import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5000;


connectDB();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use(cors({
  origin: "https://flowtalk554.onrender.com", 
  credentials: true, 
}));


app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);


server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
