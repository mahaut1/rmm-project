import {
  getAllAlerts,
  insertAlert,
  resolveAlert,
} from "../services/alert.service.js";

export async function listAlerts(req, res) {
  try {
    const alerts = await getAllAlerts();
    res.json(alerts);
  } catch (err) {
    console.error("listAlerts error:", err);
    res.status(500).json({ error: "Failed to fetch alerts" });
  }
}

export async function createAlert(req, res) {
  try {
    const {
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
    } = req.body;

    if (!title) {
      return res.status(400).json({ error: "title is required" });
    }

    const alert = await insertAlert({
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
    });

    res.status(201).json(alert);
  } catch (err) {
    console.error("createAlert error:", err);
    res.status(500).json({ error: "Failed to create alert" });
  }
}

export async function markAlertAsResolved(req, res) {
  try {
    const { id } = req.params;

    const alert = await resolveAlert(id);

    if (!alert) {
      return res.status(404).json({ error: "Alert not found" });
    }

    res.json(alert);
  } catch (err) {
    console.error("markAlertAsResolved error:", err);
    res.status(500).json({ error: "Failed to resolve alert" });
  }
}