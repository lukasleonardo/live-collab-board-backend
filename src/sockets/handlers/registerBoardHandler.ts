import { Server, Socket } from "socket.io";

export const registerBoardHandlers = (io: Server, socket: Socket) => {

  socket.on("board:join", (boardId) => {
    socket.join(boardId);
    console.log(`Cliente conectado ao board ${boardId}`);
  });

  socket.on("board:leave", (boardId) => {
    socket.leave(boardId);
    console.log(`Cliente desconectado do board ${boardId}`);
  });
  
  socket.on("board:create", (board) => {
    socket.broadcast.emit("board:created", board);
  });

  socket.on("board:update", (board) => {
    socket.broadcast.emit("board:updated", board);
  });

  socket.on("board:delete", (boardId) => {
    socket.broadcast.emit("board:deleted", boardId);
  }); 

};
