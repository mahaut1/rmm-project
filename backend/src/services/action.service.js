import { query } from "../config/db.js";

export async function findActionsByAgentId(agentId) {
  const res = await query(
    `SELECT a.*, ar.output, ar.error
     FROM actions a
     LEFT JOIN action_results ar ON ar.action_id = a.action_id
     WHERE a.agent_id = $1
     ORDER BY a.created_at DESC`,
    [agentId]
  );
  return res.rows;
}

export async function createAction(agentId, type, payload) {
  const res = await query(
    `INSERT INTO actions (agent_id, type, payload)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [agentId, type, payload]
  );
  return res.rows[0];
}
