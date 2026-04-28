import express from "express";
import cors from "cors";
import { query } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import clientsRoutes from "./routes/clients.routes.js";
import tokensRoutes from "./routes/tokens.routes.js";
import agentsRoutes from "./routes/agents.routes.js";
import actionsRoutes from "./routes/actions.routes.js";
import internalRoutes from "./routes/internal.routes.js";
import ticketsRoutes from "./routes/tickets.routes.js";
import alertsRoutes from "./routes/alerts.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", async (req, res) => {
  try {
    const result = await query("SELECT NOW() AS now, current_database() AS db");

    res.json({
      status: "ok",
      postgres: result.rows[0]
    });
  } catch (err) {
    console.error("Health check error:", err);
    res.status(500).json({ status: "error", message: "Database connection failed" });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/clients", clientsRoutes);
app.use("/api/tokens", tokensRoutes);
app.use("/api/agents", agentsRoutes);
app.use("/api/actions", actionsRoutes);
app.use("/api/tickets", ticketsRoutes);
app.use("/api/alerts", alertsRoutes);
// on sécurisera internal autrement
app.use("/internal", internalRoutes);

export default app;