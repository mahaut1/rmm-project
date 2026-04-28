import { apiFetch } from "./api.js";

const clientsContainer = document.querySelector("#clients-container");

let alerts = [];

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
  if (!date) return "Date inconnue";

  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

async function loadAlerts() {
  try {
    const data = await apiFetch("/api/alerts");
    alerts = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Impossible de charger les alertes :", error);
    alerts = [];
  }
}

function getLatestAlertForClient(clientId) {
  return alerts.find((alert) => alert.client_id === clientId);
}

function getClientName(client) {
  return escapeHtml(client.name || "Client sans nom");
}

function getClientCreatedDate(client) {
  return formatDate(client.created_at);
}

function getClientShortId(client) {
  if (!client.client_id) return "ID inconnu";
  return escapeHtml(client.client_id.slice(0, 8));
}

function createExpandedClientCard(client) {
  const latestAlert = getLatestAlertForClient(client.client_id);

  return `
    <div class="card expanded">
      <div class="card-top-row">
        <div>
          <div class="card-name">${getClientName(client)}</div>
          <div style="font-size:13px;color:rgba(255,255,255,0.6);margin-top:2px;">
            Créé le ${getClientCreatedDate(client)}
          </div>
        </div>

        <div class="card-img card-img-servers">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1.5">
            <rect x="2" y="3" width="20" height="4" rx="1" />
            <rect x="2" y="10" width="20" height="4" rx="1" />
            <rect x="2" y="17" width="20" height="4" rx="1" />
            <circle cx="18" cy="5" r="1" fill="rgba(255,255,255,0.4)" />
            <circle cx="18" cy="12" r="1" fill="rgba(255,255,255,0.4)" />
            <circle cx="18" cy="19" r="1" fill="rgba(255,255,255,0.4)" />
          </svg>
        </div>
      </div>

      <div class="card-phone">
        Client #${getClientShortId(client)}
        <div class="toggle on"></div>
      </div>

      <div class="card-body">
        <div class="bars-chart">
          <div class="bar" style="height:35%"></div>
          <div class="bar" style="height:55%"></div>
          <div class="bar green" style="height:80%"></div>
          <div class="bar" style="height:45%"></div>
          <div class="bar red" style="height:60%"></div>
        </div>

        <div class="alerts-panel">
          <div class="alerts-title">Dernière alerte</div>

          <div class="alert-row">
            <span class="alert-text">
              ${
                latestAlert
                  ? escapeHtml(latestAlert.title)
                  : "Aucune alerte pour ce client"
              }
            </span>

            <span class="alert-date">
              ${latestAlert ? formatDate(latestAlert.created_at) : "-"}
            </span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function createSimpleClientCard(client, index) {
  const latestAlert = getLatestAlertForClient(client.client_id);

  const imageStyle =
    index % 2 === 0
      ? 'style="background:linear-gradient(135deg, #92400e, #78350f)"'
      : "";

  return `
    <div class="simple-card">
      <div class="simple-card-left">
        <div class="simple-card-row">
          <span style="font-size:15px;font-weight:600;color:var(--text-primary)">
            ${getClientName(client)}
          </span>

          <span style="font-size:13px;color:var(--text-secondary)">
            ${
              latestAlert
                ? `Dernière alerte : ${escapeHtml(latestAlert.title)}`
                : `Créé le ${getClientCreatedDate(client)}`
            }
          </span>
        </div>

        <div style="display:flex;align-items:center;gap:10px;margin-top:4px;">
          <span style="font-family:var(--mono);font-size:12.5px;color:var(--accent)">
            Client #${getClientShortId(client)}
          </span>

          <div class="toggle on"></div>
        </div>
      </div>

      <div class="simple-card-img" ${imageStyle}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="1.5">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87" />
        </svg>
      </div>
    </div>
  `;
}

function createClientCard(client, index) {
  return index === 0
    ? createExpandedClientCard(client)
    : createSimpleClientCard(client, index);
}

function enableToggles() {
  document.querySelectorAll(".toggle").forEach((toggle) => {
    toggle.addEventListener("click", () => {
      toggle.classList.toggle("on");
    });
  });
}

async function loadClients() {
  try {
    clientsContainer.innerHTML = `<p class="loading-message">Chargement des clients...</p>`;

    await loadAlerts();

    const clients = await apiFetch("/api/clients");

    if (!Array.isArray(clients) || clients.length === 0) {
      clientsContainer.innerHTML = `
        <p class="empty-message">Aucun client trouvé.</p>
      `;
      return;
    }

    clientsContainer.innerHTML = clients
      .map((client, index) => createClientCard(client, index))
      .join("");

    enableToggles();
  } catch (error) {
    clientsContainer.innerHTML = `
      <p class="error-message">
        Impossible de charger les clients : ${escapeHtml(error.message)}
      </p>
    `;
  }
}

checkAuthentication();
loadClients();