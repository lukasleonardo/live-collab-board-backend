import { Server, Socket as SocketIO } from "socket.io";
import { registerBoardHandlers } from "./handlers/registerBoardHandler";
import { registerTaskHandlers } from "./handlers/registerTaskHandlers";

interface ExtendedSocket extends SocketIO {
  boardIds: Set<string>;
}

export const registerSocketHandlers = (io: Server) => {
  io.on("connection", (rawSocket) => {
    const socket = rawSocket as ExtendedSocket;

    registerBoardHandlers(io, socket);
    registerTaskHandlers(io, socket);

    socket.on("disconnecting", () => {
      if (socket.boardIds) {
        socket.boardIds.forEach((boardId) => {
          const roomInfo = io.sockets.adapter.rooms.get(boardId);
          const numUsers = roomInfo ? roomInfo.size - 1 : 0; 
          io.to(boardId).emit("board:users", { count: numUsers });
          console.log(`Usuário desconectou do board ${boardId}. Total: ${numUsers}`);
        });
      }
    });

    socket.on("disconnect", () => {
      console.log(`Cliente desconectado: ${socket.id}`);
    });
  });
};
