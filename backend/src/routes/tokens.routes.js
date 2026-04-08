import { Router } from "express";
import {
  // tes controllers ici
} from "../controllers/tokens.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/requireRole.js";

const router = Router();

// exemples
router.get("/", authMiddleware, requireRole("admin"), (req, res) => {
  res.json({ message: "tokens secured" });
});

router.post("/", authMiddleware, requireRole("admin"), (req, res) => {
  res.json({ message: "create token secured" });
});

export default router;