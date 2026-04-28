import { query } from "../config/db.js";

/**
 * Récupérer un agent par client
 */
export async function findAgentByClientId(clientId) {
  const res = await query(
    `SELECT a.*, c.name AS client_name
     FROM agents a
     LEFT JOIN clients c ON c.client_id = a.client_id
     WHERE a.client_id = $1`,
    [clientId]
  );

  return res.rows[0];
}

/**
 * Créer un agent (appareil)
 */
export async function createAgent({ client_id, hostname, os }) {
  const res = await query(
    `INSERT INTO agents (
      client_id,
      hostname,
      os,
      status,
      device_type
    )
    VALUES ($1, $2, $3, 'online', 'PC')
    RETURNING *`,
    [client_id, hostname, os]
  );

  return res.rows[0];
}

/**
 * Mettre à jour le last seen (heartbeat agent)
 */
export async function updateLastSeen(agentId) {
  await query(
    `UPDATE agents
     SET last_seen_at = NOW()
     WHERE agent_id = $1`,
    [agentId]
  );
}

/**
 * Récupérer tous les agents (pour la page Appareils)
 */
export async function getAllAgents() {
  const res = await query(`
    SELECT
      a.agent_id,
      a.hostname,
      a.os,
      a.status,
      a.device_type,
      a.ip_address,
      a.version,
      a.last_seen_at,
      a.created_at,

      a.alerts_count,
      a.patches_count,
      a.reboot_required,
      a.remote_access_enabled,

      c.name AS client_name

    FROM agents a
    LEFT JOIN clients c ON c.client_id = a.client_id

    ORDER BY a.created_at DESC
  `);

  return res.rows;
}

/**
 * Assigner un agent à un client
 */
export async function assignAgentToClient(agentId, clientId) {
  const res = await query(
    `UPDATE agents
     SET client_id = $2
     WHERE agent_id = $1
     RETURNING *`,
    [agentId, clientId]
  );

  return res.rows[0];
}

/**
 * Mettre à jour le statut (online/offline)
 */
export async function updateAgentStatus(agentId, status) {
  const res = await query(
    `UPDATE agents
     SET status = $2
     WHERE agent_id = $1
     RETURNING *`,
    [agentId, status]
  );

  return res.rows[0];
}