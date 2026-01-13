import express from "express";
import cors from "cors";
import { query } from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import clientsRoutes from "./routes/clients.routes.js";
import tokensRoutes from "./routes/tokens.routes.js";
import agentsRoutes from "./routes/agents.routes.js";
import actionsRoutes from "./routes/actions.routes.js";
import internalRoutes from "./routes/internal.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", async (req, res) => {
  try {
    const result = await query(
      "SELECT current_user, current_database(), inet_server_addr(), inet_server_port()"
    );
    res.json({ status: "ok", info: result.rows[0] });
  } catch (err) {
    console.error("HEALTH DB ERROR:", err);
    res.status(500).json({ status: "error", message: err.message, code: err.code });
  }
});

app.use("/auth", authRoutes);
app.use("/api/clients", clientsRoutes);
app.use("/api/tokens", tokensRoutes);
app.use("/api/agents", agentsRoutes);
app.use("/api/actions", actionsRoutes);
app.use("/internal", internalRoutes);

export default app;
