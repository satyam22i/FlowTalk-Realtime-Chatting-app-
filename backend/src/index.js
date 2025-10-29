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

// ✅ Connect to DB
connectDB();

// ✅ Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ CORS configuration
app.use(
  cors({
    origin: true,          // allow all origins dynamically
    credentials: true,     // allow cookies & credentials
  })
);

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

// ✅ Start Server
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
