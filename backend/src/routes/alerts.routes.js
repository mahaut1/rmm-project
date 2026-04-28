import { Router } from "express";
import {
  listAlerts,
  createAlert,
  markAlertAsResolved,
} from "../controllers/alerts.controller.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/requireRole.js";

const router = Router();

router.get("/", authMiddleware, requireRole("admin"), listAlerts);
router.post("/", authMiddleware, requireRole("admin"), createAlert);
router.patch("/:id/resolve", authMiddleware, requireRole("admin"), markAlertAsResolved);

export default router;