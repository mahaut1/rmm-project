import fetch from "node-fetch";

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOTQ0ZDU5NWMtMDljNy00NjA5LWJkM2MtYjYzZDZjZDU0NTdiIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzczODQwMDM4LCJleHAiOjE3NzM5MjY0Mzh9.aih-XPo7MP3QBekOvGz7riSKUWNAuv53L-qwx-oC4Is";

const clients = [
  "Alpha", "Beta", "Gamma", "Delta", "Epsilon",
  "Zeta", "Eta", "Theta", "Iota", "Kappa",
  "Lambda", "Mu", "Nu", "Xi", "Omicron",
  "Pi", "Rho", "Sigma", "Tau", "Upsilon",
  "Phi", "Chi", "Psi", "Omega"
];

async function createClients() {
  for (const name of clients) {
    const res = await fetch("http://localhost:3000/api/clients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${TOKEN}`
      },
      body: JSON.stringify({ name })
    });

    const data = await res.json();
    console.log("Created:", data.client?.name);
  }
}

createClients();