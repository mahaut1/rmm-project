import { Router } from "express";
import {
  listAgentActions,
  createAgentAction,
} from "../controllers/actions.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/requireRole.js";

const router = Router();

router.get("/agent/:agentId", authMiddleware, requireRole("admin"), listAgentActions);
router.post("/", authMiddleware, requireRole("admin"), createAgentAction);

export default router;