import { Router } from "express";
import { listClients, createClient } from "../controllers/clients.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/requireRole.js";

const router = Router();

router.get("/", authMiddleware, requireRole("admin"), listClients);
router.post("/", authMiddleware, requireRole("admin"), createClient);

export default router;