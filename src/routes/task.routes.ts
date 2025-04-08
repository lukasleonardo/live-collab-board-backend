import express from "express";

import { protect } from "../middleware/authMiddleware";

import { create, listByUser, listByBoard, update, removeTask, assignToTask, changeTaskStatus, updateTasksinBatch } from "../controllers/taskController";
const router = express.Router();

router.post("/", protect, create); // Criar tarefa
router.post("/user/:id", protect, assignToTask);// ajustando!!
router.get("/user", protect, listByUser); 
router.get("/board/:boardId", protect, listByBoard); // Listar tarefas de um quadro
router.put("/:id", protect, update); // Atualizar tarefa
router.delete("/:id", protect, removeTask); // Deletar tarefa
router.patch("/status/:id", protect, changeTaskStatus);
router.patch("/reorder", protect, updateTasksinBatch);



export default router;
