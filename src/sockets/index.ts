import { Server } from "socket.io";
import { taskSocketHandler } from "./taskSocket";
import { boardSocketHandler } from "./boardSocket";
let io: Server | null = null;;
export const initializeWebSocket = (server: any) => {
  const io = new Server(server, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    console.log(`Novo cliente conectado: ${socket.id}`);
    
    // Adiciona os módulos de WebSocket
    taskSocketHandler(io, socket);
    boardSocketHandler(io, socket);
  });

  return io;
};

export const getIO = ():Server => {
  if (!io) {
    throw new Error("Socket.io não foi inicializado!");
  }
  return io;
};
