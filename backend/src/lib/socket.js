import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);

// THIS IS THE CORRECT CODE
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:5173', 
      'https://flowtalk.vercel.app'
    ],
    methods: ['GET', 'POST'],
  }
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}


//cheak online user
const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("A User Connected", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap)) // this is send event for all connected user

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
