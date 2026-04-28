import { apiFetch } from "./api.js";

const devicesList = document.querySelector("#devices-list");
const searchInput = document.querySelector("#device-search");
const displayCount = document.querySelector("#display-count");

let agents = [];

function checkAuthentication() {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "./connexion.html";
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(date) {
  if (!date) return "Jamais connecté";

  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatStatus(status) {
  if (status === "offline") return "Hors ligne";
  return "En ligne";
}

function createDeviceRow(agent) {
  const hostname = escapeHtml(agent.hostname || "Appareil inconnu");
  const os = escapeHtml(agent.os || "N/A");
  const clientName = escapeHtml(agent.client_name || "Client inconnu");
  const status = agent.status === "offline" ? "offline" : "online";
  const statusLabel = formatStatus(status);
  const lastSeen = formatDate(agent.last_seen_at || agent.created_at);
  const deviceType = escapeHtml(agent.device_type || "PC");
  const alerts = Number(agent.alerts_count || 0);
  const patches = Number(agent.patches_count || 0);
  const rebootRequired = Boolean(agent.reboot_required);
  const remoteEnabled = agent.remote_access_enabled !== false;

  return `
    <div class="table-row">
      <div>
        <input type="checkbox" value="${escapeHtml(agent.agent_id)}">
      </div>

      <div class="device-name">
        <span>${hostname}</span>
        <span class="star">☆</span>
      </div>

      <div>
        <button class="ai-btn" type="button">✦</button>
      </div>

      <div class="muted">${lastSeen}</div>

      <div class="status">
        <span class="status-dot ${status}"></span>
        <span>${statusLabel}</span>
      </div>

      <div>${deviceType}</div>

      <div>
        <a href="#" class="client-link">${clientName}</a>
      </div>

      <div>
        <span class="badge">${alerts}</span>
      </div>

      <div>
        <span class="badge ${patches > 0 ? "blue" : ""}">${patches}</span>
      </div>

      <div>
        <button class="reboot-btn ${rebootRequired ? "" : "disabled"}" type="button">
          ⏻
        </button>
      </div>

      <div>
        <button class="remote-btn ${remoteEnabled ? "active" : "disabled"}" type="button">
          🔧
        </button>
      </div>
    </div>
  `;
}

function renderAgents(agentsToRender) {
  if (!Array.isArray(agentsToRender) || agentsToRender.length === 0) {
    devicesList.innerHTML = `
      <div class="table-row">
        <div></div>
        <div>Aucun appareil trouvé.</div>
      </div>
    `;

    displayCount.textContent = "Nombre d'appareils affichés : 0";
    return;
  }

  devicesList.innerHTML = agentsToRender.map(createDeviceRow).join("");

  displayCount.textContent = `Nombre d'appareils affichés : ${agentsToRender.length} sur ${agents.length}`;
}

function filterAgents() {
  const search = searchInput.value.trim().toLowerCase();

  if (!search) {
    renderAgents(agents);
    return;
  }

  const filteredAgents = agents.filter((agent) => {
    return [
      agent.hostname,
      agent.os,
      agent.status,
      agent.device_type,
      agent.ip_address,
      agent.version,
      agent.client_name,
    ]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(search));
  });

  renderAgents(filteredAgents);
}

async function loadAgents() {
  try {
    devicesList.innerHTML = `
      <div class="table-row">
        <div></div>
        <div>Chargement des appareils...</div>
      </div>
    `;

    const data = await apiFetch("/api/agents");
    agents = Array.isArray(data) ? data : data.agents || [];

    renderAgents(agents);
  } catch (error) {
    devicesList.innerHTML = `
      <div class="table-row">
        <div></div>
        <div>Impossible de charger les appareils : ${escapeHtml(error.message)}</div>
      </div>
    `;
  }
}

searchInput.addEventListener("input", filterAgents);

checkAuthentication();
loadAgents();