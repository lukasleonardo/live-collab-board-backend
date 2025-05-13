import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import connectDB from "./config/database";
import authRoutes from "./routes/auth.routes";
import boardRoutes from "./routes/board.routes";
import taskRoutes from "./routes/task.routes";
import { registerSocketHandlers } from "./sockets";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { 
    cors: { 
        origin: "http://localhost:5173",
        methods: ["GET", "POST","PATCH","DELETE"],
        credentials: true,
        allowedHeaders: ["Content-Type"], 
    } });
registerSocketHandlers(io);

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST","PATCH","DELETE"],
  credentials: true,
}));
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/tasks", taskRoutes);
// Conectar ao banco de dados
connectDB();

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`🚀 https://localhost:${PORT}`);
});
