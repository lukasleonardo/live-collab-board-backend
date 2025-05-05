import { Server } from "socket.io";
import { registerBoardHandlers } from "./handlers/registerBoardHandler";
import { registerTaskHandlers } from "./handlers/registerTaskHandlers";
let io: Server | null = null;;
export const registerSocketHandlers = (io: Server) => {
  io.on("connection", (socket) => {
    registerBoardHandlers(io,socket)
    registerTaskHandlers(io,socket)

    socket.on("disconnect", () => {
      console.log(`Cliente desconectado: ${socket.id}`);
    })
  })
};
