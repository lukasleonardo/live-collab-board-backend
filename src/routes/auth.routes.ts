import express from "express";
import { register, login, listUsers } from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/users",protect, listUsers);

export default router;
