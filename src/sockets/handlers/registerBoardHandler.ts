import { Server, Socket } from "socket.io";

interface ExtendedSocket extends Socket {
  boardIds: Set<string>;
}

export const registerBoardHandlers = (io: Server, rawSocket: Socket) => {
  const socket = rawSocket as ExtendedSocket;

  socket.boardIds = new Set();

  socket.on("board:join", (boardId) => {
    socket.join(boardId);
    socket.boardIds.add(boardId);

    const numUsers = io.sockets.adapter.rooms.get(boardId)?.size || 0;
    io.to(boardId).emit("board:users", { count: numUsers });
    console.log(`Usuário entrou no board ${boardId}. Total: ${numUsers}`);
  });

  socket.on("board:leave", (boardId) => {
    socket.leave(boardId);
    socket.boardIds.delete(boardId);

    const room = io.sockets.adapter.rooms.get(boardId);
    const numUsers = room ? room.size : 0;
    console.log(`Cliente desconectado do board ${boardId}, Numero de usuarios: ${numUsers}`);

    io.to(boardId).emit("board:users", { count: numUsers });
  });

  socket.on("board:create", (board) => {
    io.emit("board:created", board);
  });

  socket.on("board:update", (board, boardId) => {
    console.log("board:update", board, boardId);
    io.to(boardId).emit("board:updated", { board, boardId });
  });

  socket.on("board:delete", (boardId) => {
    io.emit("board:deleted", boardId);
  });
};
