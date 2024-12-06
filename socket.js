const { Server } = require("socket.io");
const AppError = require("./middlewares/errorHandler");

let io;

const createSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000", // Your React app's URL
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    },
  });

  return io;
};

const getIO = () => {
  if (!io) throw new AppError("Socket.io is not available", 404);
  return io;
};

module.exports = { createSocket, getIO };
