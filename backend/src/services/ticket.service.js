import { query } from "../config/db.js";

export async function getAllTickets() {
  const res = await query(
    `SELECT
       t.ticket_id,
       t.client_id,
       t.agent_id,
       t.assigned_to,
       t.title,
       t.description,
       t.type,
       t.priority,
       t.status,
       t.contact,
       t.impact,
       t.start_date,
       t.end_date,
       t.created_at,
       t.updated_at,

       c.name AS client_name,

       a.hostname AS agent_hostname,
       a.os AS agent_os,

     u.name AS technician_name,
     u.email AS technician_email,
       u.role AS technician_role

     FROM tickets t
     LEFT JOIN clients c ON c.client_id = t.client_id
     LEFT JOIN agents a ON a.agent_id = t.agent_id
     LEFT JOIN users u ON u.user_id = t.assigned_to
     ORDER BY t.created_at DESC`
  );

  return res.rows;
}

export async function insertTicket({
  client_id = null,
  agent_id = null,
  assigned_to = null,
  title,
  description = null,
  type = "incident",
  priority = "medium",
  status = "open",
  contact = null,
  impact = null,
  start_date = null,
  end_date = null,
}) {
  const res = await query(
    `INSERT INTO tickets (
      client_id,
      agent_id,
      assigned_to,
      title,
      description,
      type,
      priority,
      status,
      contact,
      impact,
      start_date,
      end_date
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
    RETURNING *`,
    [
      client_id,
      agent_id,
      assigned_to,
      title,
      description,
      type,
      priority,
      status,
      contact,
      impact,
      start_date,
      end_date,
    ]
  );

  return res.rows[0];
}