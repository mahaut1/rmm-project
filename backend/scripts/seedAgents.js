import { query } from "../src/config/db.js";
import crypto from "node:crypto";

async function seedAgents() {
  try {
    const agents = [
      {
        client_id: "cdd563fa-a8b1-4ce9-beec-102afa2803a9",
        hostname: "PC-OMEGA",
        os: "windows"
      },
      {
        client_id: "dd9cc030-7ded-44a2-9f68-7106ca5c4f1f",
        hostname: "PC-PSI",
        os: "linux"
      },
      {
        client_id: "6b568e9c-200f-46e8-b256-4371e8c1b61d",
        hostname: "PC-CHI",
        os: "macos"
      },
      {
        client_id: "ba9d3720-9083-4060-aa31-c5a423b24f8f",
        hostname: "PC-PHI",
        os: "windows"
      }
    ];

    for (const agent of agents) {
      const agent_id = crypto.randomUUID();

      await query(
        `
        INSERT INTO agents (agent_id, client_id, hostname, os)
        VALUES ($1, $2, $3, $4)
        `,
        [agent_id, agent.client_id, agent.hostname, agent.os]
      );

      console.log("✅ Agent created:", agent.hostname);
    }

    process.exit(0);
  } catch (err) {
    console.error("❌ seedAgents error:", err);
    process.exit(1);
  }
}

seedAgents();