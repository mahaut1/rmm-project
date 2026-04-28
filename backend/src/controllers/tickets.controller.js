import {
  getAllTickets,
  insertTicket,
} from "../services/ticket.service.js";

export async function listTickets(req, res) {
  try {
    const tickets = await getAllTickets();
    res.json(tickets);
  } catch (err) {
    console.error("listTickets error:", err);
    res.status(500).json({ error: "Failed to fetch tickets" });
  }
}

export async function createTicket(req, res) {
  try {
    const {
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
    } = req.body;

    if (!title) {
      return res.status(400).json({ error: "title is required" });
    }

    const ticket = await insertTicket({
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
    });

    res.status(201).json(ticket);
  } catch (err) {
    console.error("createTicket error:", err);
    res.status(500).json({ error: "Failed to create ticket" });
  }
}