import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getClients, createClient } from "../controllers/clients.controller.js";

const router = Router();

router.use(authMiddleware);

router.get("/", getClients);
router.post("/", createClient);

export default router;
