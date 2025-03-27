import { Server, Socket } from "socket.io";

export const taskSocketHandler = (io: Server, socket: Socket) => {
  console.log(`Cliente conectado: ${socket.id} (Tasks)`);

  socket.on("task:create", (task) => {
    io.emit("task:created", task);
  });

  socket.on("task:update", (task) => {
    io.emit("task:updated", task);
  });

  socket.on("task:delete", (taskId) => {
    io.emit("task:deleted", taskId);
  });

  socket.on("disconnect", () => {
    console.log(`Cliente desconectado: ${socket.id} (Tasks)`);
  });
};
