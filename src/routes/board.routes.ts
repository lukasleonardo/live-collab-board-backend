import express from "express";
import { create, listBoards, getOne, update, remove } from "../controllers/boardController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", protect, create); // Criar quadro
router.get("/", protect, listBoards); // Listar quadros do usuário
router.get("/:id", protect, getOne); // Obter um quadro específico
router.put("/:id", protect, update); // Atualizar quadro
router.delete("/:id", protect, remove); // Deletar quadro

export default router;
