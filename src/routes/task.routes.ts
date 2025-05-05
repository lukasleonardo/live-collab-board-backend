import express from "express";

import { protect } from "../middleware/authMiddleware";

import { create, listByUser, listByBoard, update, removeTask, organizeTasks, getTaskById } from "../controllers/taskController";
const router = express.Router();

router.post("/", protect, create); // Criar tarefa
router.get("/user", protect, listByUser); 
router.patch("/reorder", protect, organizeTasks);
router.get("/board/:boardId", protect, listByBoard); // Listar tarefas de um quadro
router.patch("/:id", protect, update); // Atualizar tarefa
router.delete("/:id", protect, removeTask); // Deletar tarefa
router.get("/:id", protect, getTaskById);


export default router;
