import {
  findActionsByAgentId,
  createAction,
} from "../services/action.service.js";

export async function listAgentActions(req, res) {
  try {
    const { agentId } = req.params;
    const actions = await findActionsByAgentId(agentId);
    res.json(actions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch actions" });
  }
}

export async function createAgentAction(req, res) {
  try {
    const { agent_id, type, payload } = req.body;

    if (!agent_id || !type) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const action = await createAction(agent_id, type, payload);
    res.status(201).json(action);
  } catch (err) {
    res.status(500).json({ error: "Failed to create action" });
  }
}