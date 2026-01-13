// backend/src/services/token.service.js
import { query } from "../config/db.js";
import { createInstallationToken } from "./collector.service.js";

/**
 * Retourne tous les tokens d'installation pour un client donné.
 */
export async function findTokensByClient(clientId) {
  const res = await query(
    `SELECT * FROM installation_tokens
     WHERE client_id = $1
     ORDER BY created_at DESC`,
    [clientId]
  );
  return res.rows;
}

/**
 * Crée un token d'installation pour un client.
 * 1. Demande un token au collector
 * 2. Le stocke en base
 * 3. Le renvoie
 */
export async function createToken(clientId) {
  // 1. demander un token au collector
  const { token } = await createInstallationToken(clientId);

  // 2. stocker en base
  await query(
    `INSERT INTO installation_tokens (client_id, token)
     VALUES ($1, $2)`,
    [clientId, token]
  );

  return token;
}
