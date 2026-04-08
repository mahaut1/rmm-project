import {
  getAllClients,
  insertClientWithApiKey,
} from "../services/client.service.js";

export async function listClients(req, res) {
  try {
    const clients = await getAllClients();
    res.json(clients);
  } catch (err) {
    console.error("listClients error:", err);
    res.status(500).json({ error: "Failed to fetch clients" });
  }
}

export async function createClient(req, res) {
  try {
    const { name, user_id } = req.body;

    if (!name) {
      return res.status(400).json({ error: "name is required" });
    }

    const result = await insertClientWithApiKey({ name, user_id });
    res.status(201).json(result);
  } catch (err) {
    console.error("createClient error:", err);
    res.status(500).json({ error: "Failed to create client" });
  }
}