import { getAllClients, insertClientWithApiKey } from "../services/client.service.js";

export async function getClients(req, res) {
  try {
    const clients = await getAllClients();
    res.json(clients);
  } catch (err) {
    console.error("Error in getClients:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function createClient(req, res) {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "name is required" });
  }

  try {
    const user_id = null;

    const result = await insertClientWithApiKey({ name, user_id });
    res.status(201).json(result);
} catch (err) {
  console.error("Error in createClient (FULL):");
  console.error(err);
  if (err?.response) {
    console.error("Collector status:", err.response.status);
    console.error("Collector data:", err.response.data);
  }
  res.status(500).json({ message: "Server error" });
}

}
