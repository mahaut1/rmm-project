import {
  createAgent,
  findAgentByClientId,
  updateLastSeen,
} from "../services/agent.service.js";
import { getAllAgents } from "../services/agent.service.js";

export async function registerAgent(req, res) {
  try {
    const { client_id, hostname, os } = req.body;

    if (!client_id || !hostname) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const agent = await createAgent({ client_id, hostname, os });
    res.status(201).json(agent);
  } catch (err) {
    console.error("registerAgent error:", err);
    res.status(500).json({ error: "Failed to register agent" });
  }
}

export async function heartbeat(req, res) {
  try {
    const { agent_id } = req.body;

    if (!agent_id) {
      return res.status(400).json({ error: "agent_id is required" });
    }

    await updateLastSeen(agent_id);
    res.json({ status: "ok" });
  } catch (err) {
    console.error("heartbeat error:", err);
    res.status(500).json({ error: "Heartbeat failed" });
  }
}

export async function listAgents(req, res) {
  try {
    const agents = await getAllAgents();
    res.json(agents);
  } catch (err) {
    console.error("listAgents error:", err);
    res.status(500).json({ error: "Failed to fetch agents" });
  }
}