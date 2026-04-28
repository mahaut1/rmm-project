import { query } from "../config/db.js";

export async function getAllAlerts() {
  const res = await query(
    `SELECT
       al.alert_id,
       al.client_id,
       al.agent_id,
       al.ticket_id,
       al.title,
       al.description,
       al.severity,
       al.category,
       al.status,
       al.metric_name,
       al.metric_value,
       al.threshold,
       al.created_at,
       al.resolved_at,

       c.name AS client_name,
       a.hostname AS agent_hostname,
       a.os AS agent_os,
       t.title AS ticket_title

     FROM alerts al
     LEFT JOIN clients c ON c.client_id = al.client_id
     LEFT JOIN agents a ON a.agent_id = al.agent_id
     LEFT JOIN tickets t ON t.ticket_id = al.ticket_id
     ORDER BY al.created_at DESC`
  );

  return res.rows;
}

export async function insertAlert({
  client_id = null,
  agent_id = null,
  ticket_id = null,
  title,
  description = null,
  severity = "warning",
  category = "system",
  status = "open",
  metric_name = null,
  metric_value = null,
  threshold = null,
}) {
  const res = await query(
    `INSERT INTO alerts (
      client_id,
      agent_id,
      ticket_id,
      title,
      description,
      severity,
      category,
      status,
      metric_name,
      metric_value,
      threshold
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
    RETURNING *`,
    [
      client_id,
      agent_id,
      ticket_id,
      title,
      description,
      severity,
      category,
      status,
      metric_name,
      metric_value,
      threshold,
    ]
  );

  return res.rows[0];
}

export async function resolveAlert(alertId) {
  const res = await query(
    `UPDATE alerts
     SET status = 'resolved',
         resolved_at = NOW()
     WHERE alert_id = $1
     RETURNING *`,
    [alertId]
  );

  return res.rows[0];
}