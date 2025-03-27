import { Server, Socket } from "socket.io";

export const boardSocketHandler = (io: Server, socket: Socket) => {
  console.log(`Cliente conectado: ${socket.id} (Boards)`);

  socket.on("board:create", (board) => {
    io.emit("board:created", board);
  });

  socket.on("board:update", (board) => {
    io.emit("board:updated", board);
  });

  socket.on("board:delete", (boardId) => {
    io.emit("board:deleted", boardId);
  });

  socket.on("disconnect", () => {
    console.log(`Cliente desconectado: ${socket.id} (Boards)`);
  });
};
