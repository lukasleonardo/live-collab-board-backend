import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import connectDB from "./config/database";
import authRoutes from "./routes/auth.routes";
import boardRoutes from "./routes/board.routes";
import taskRoutes from "./routes/task.routes";
import { initializeWebSocket } from "./sockets";

dotenv.config();

const app = express();
const server = createServer(app);
initializeWebSocket(server);

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/tasks", taskRoutes);
// Conectar ao banco de dados
connectDB();



export { server };