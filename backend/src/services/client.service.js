import { query } from "../config/db.js";
import { createCollectorClient } from "./collector.service.js";

/**
 * Liste tous les clients avec leur api_key (si existe)
 */
export async function getAllClients() {
  const res = await query(
    `SELECT
       c.client_id,
       c.name,
       c.created_at,
       c.user_id,
       ak.api_key
     FROM clients c
     LEFT JOIN api_keys ak ON ak.client_id = c.client_id
     ORDER BY c.created_at DESC`
  );

  return res.rows;
}

/**
 * Crée un client, appelle le collector pour récupérer une api_key,
 * puis stocke l'api_key en base.
 */
export async function insertClientWithApiKey({ name, user_id = null }) {
  // 1) créer client en DB
  const clientRes = await query(
    `INSERT INTO clients (name, user_id)
     VALUES ($1, $2)
     RETURNING client_id, name, created_at, user_id`,
    [name, user_id]
  );

  const client = clientRes.rows[0];

  // 2) appeler le collector (ton service attend un "name")
  const collectorData = await createCollectorClient(name);
  const api_key = collectorData.api_key;

  if (!api_key) {
    throw new Error("Collector did not return api_key");
  }

  // 3) stocker api_key en DB
  await query(
    `INSERT INTO api_keys (api_key, client_id)
     VALUES ($1, $2)`,
    [api_key, client.client_id]
  );

  return { client, api_key };
}
