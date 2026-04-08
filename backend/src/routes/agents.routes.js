import { Router } from "express";
import { registerAgent, heartbeat } from "../controllers/agents.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/requireRole.js";
import { listAgents } from "../controllers/agents.controller.js";

const router = Router();

router.post("/register", authMiddleware, requireRole("admin"), registerAgent);
router.post("/heartbeat", authMiddleware, requireRole("admin"), heartbeat);
router.get("/", authMiddleware, requireRole("admin"), listAgents);

export default router;