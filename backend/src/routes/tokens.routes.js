// backend/src/routes/tokens.routes.js
import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  getTokensByClient,
  createTokenForClient,
} from "../controllers/tokens.controller.js";

const router = Router();

// toutes les routes de ce fichier sont protégées par JWT
router.use(authMiddleware);

// GET /api/tokens/client/:clientId
router.get("/client/:clientId", getTokensByClient);

// POST /api/tokens/client/:clientId
router.post("/client/:clientId", createTokenForClient);

export default router;
