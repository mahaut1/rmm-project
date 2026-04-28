import { Router } from "express";
import {
  listTickets,
  createTicket,
} from "../controllers/tickets.controller.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/requireRole.js";

const router = Router();

router.get("/", authMiddleware, requireRole("admin"), listTickets);
router.post("/", authMiddleware, requireRole("admin"), createTicket);

export default router;