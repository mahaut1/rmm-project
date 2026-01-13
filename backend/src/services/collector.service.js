import axios from "axios";
import crypto from "crypto";

const baseURL = process.env.COLLECTOR_URL;

// active/désactive le fallback via .env
const fallbackEnabled = (process.env.COLLECTOR_FALLBACK || "true") === "true";

function randomApiKey() {
  return crypto.randomBytes(32).toString("hex"); // 64 chars
}

function randomToken() {
  return crypto.randomBytes(24).toString("hex");
}

export async function createCollectorClient(name) {
  if (!baseURL) {
    if (!fallbackEnabled) throw new Error("COLLECTOR_URL is not set");
    return { api_key: randomApiKey() };
  }

  try {
    const res = await axios.post(`${baseURL}/admin/clients/create`, { name });
    return res.data; // { api_key, ... }
  } catch (err) {
    if (!fallbackEnabled) throw err;
    console.warn("⚠️ Collector unreachable, fallback api_key used:", err.code || err.message);
    return { api_key: randomApiKey() };
  }
}

export async function createInstallationToken(client_id) {
  if (!baseURL) {
    if (!fallbackEnabled) throw new Error("COLLECTOR_URL is not set");
    return { token: randomToken() };
  }

  try {
    const res = await axios.post(`${baseURL}/admin/installation-tokens/create`, { client_id });
    return res.data; // { token }
  } catch (err) {
    if (!fallbackEnabled) throw err;
    console.warn("⚠️ Collector unreachable, fallback token used:", err.code || err.message);
    return { token: randomToken() };
  }
}
