import { query } from "../config/db.js";

export async function findAgentByClientId(clientId) {
  const res = await query(
    `SELECT *
     FROM agents
     WHERE client_id = $1`,
    [clientId]
  );

  return res.rows[0];
}

export async function createAgent({ client_id, hostname, os }) {
  const res = await query(
    `INSERT INTO agents (client_id, hostname, os)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [client_id, hostname, os]
  );

  return res.rows[0];
}

export async function updateLastSeen(agentId) {
  await query(
    `UPDATE agents
     SET last_seen_at = NOW()
     WHERE agent_id = $1`,
    [agentId]
  );
}

export async function getAllAgents() {
  const res = await query(`
    SELECT *
    FROM agents
    ORDER BY created_at DESC
  `);

  return res.rows;
}