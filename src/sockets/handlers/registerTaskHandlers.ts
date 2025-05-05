import { Server, Socket } from "socket.io";


export const registerTaskHandlers = (io: Server, socket: Socket) => {
  socket.on("task:create", ({task, boardId}) => {
    io.to(boardId).emit("task:created", {task, boardId});
  });

  socket.on("task:update", ({task, boardId}) => {
    io.to(boardId).emit("task:updated", {task, boardId});
  });

  socket.on("task:delete", ({taskId, boardId}) => {
    io.to(boardId).emit("task:deleted", {taskId, boardId});
  });

  socket.on("task:reorder", ({task}) => {
    io.to(task.boardId).emit("task:reordered", {task, boardId: task.boardId});
  });

};
