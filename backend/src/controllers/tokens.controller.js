// backend/src/controllers/tokens.controller.js
import {
  findTokensByClient,
  createToken,
} from "../services/token.service.js";

export async function getTokensByClient(req, res) {
  const { clientId } = req.params;

  try {
    const tokens = await findTokensByClient(clientId);
    res.json(tokens);
  } catch (err) {
    console.error("Error in getTokensByClient:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function createTokenForClient(req, res) {
  const { clientId } = req.params;

  try {
    const token = await createToken(clientId);
    res.status(201).json({ token });
  } catch (err) {
    console.error("Error in createTokenForClient:", err);
    res.status(500).json({ message: "Server error" });
  }
}
