import { Router } from "express";
import { login, register } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/requireRole.js";

const router = Router();

router.post("/login", login);
router.post("/register", authMiddleware, requireRole("admin"), register);

export default router;
