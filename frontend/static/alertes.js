import { apiFetch } from "./api.js";

const alertsList = document.querySelector("#alerts-list");
const searchInput = document.querySelector("#alert-search");
const displayCount = document.querySelector("#display-count");
const resolveSelectedButton = document.querySelector("#resolve-selected-btn");
const selectAllCheckbox = document.querySelector("#select-all-alerts");

let alerts = [];

function checkAuthentication() {
  const token = localStorage.getItem("token");
  if (!token) window.location.href = "./connexion.html";
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

function getSeverityLabel(severity) {
  return {
    critical: "Critique",
    warning: "Avertissement",
    info: "Info",
  }[severity] || severity;
}

function getStatusLabel(status) {
  return {
    open: "Ouvert",
    resolved: "Résolu",
    ignored: "Ignoré",
  }[status] || status;
}

function getIconByCategory(category) {
  return {
    disk: "💾",
    performance: "⚡",
    memory: "🧠",
    availability: "🌐",
    network: "📡",
    exchange: "✉️",
  }[category] || "⚠️";
}

function createAlertRow(alert) {
  return `
    <div class="table-row">
      <div>
        <input type="checkbox" class="alert-checkbox" value="${alert.alert_id}">
      </div>

      <div class="alert-details">
        <span class="alert-icon">${getIconByCategory(alert.category)}</span>
        <div>
          <div class="alert-title">${escapeHtml(alert.title)}</div>
          <div class="alert-meta">
            ${escapeHtml(alert.client_name)} · 
            ${escapeHtml(alert.agent_hostname)} (${escapeHtml(alert.agent_os)})
          </div>
          <div class="muted">${escapeHtml(alert.description || "")}</div>
        </div>
      </div>

      <div class="muted">${formatDate(alert.created_at)}</div>

      <div>
        <span class="badge ${alert.severity}">
          ${getSeverityLabel(alert.severity)}
        </span>
      </div>

      <div>${escapeHtml(alert.category)}</div>

      <div>
        <a href="#" class="ticket-link">
          ${alert.ticket_title || "Créer un ticket"}
        </a>
      </div>

      <div class="status">
        <span class="status-dot ${alert.status}"></span>
        ${getStatusLabel(alert.status)}
      </div>

      <div>
        <button class="device-btn">...</button>
      </div>
    </div>
  `;
}

function renderAlerts(data) {
  if (!data.length) {
    alertsList.innerHTML = `<div class="table-row"><div></div><div>Aucune alerte</div></div>`;
    return;
  }

  alertsList.innerHTML = data.map(createAlertRow).join("");
  displayCount.textContent = `Nombre d’alertes : ${data.length}`;
}

function filterAlerts() {
  const search = searchInput.value.toLowerCase();

  const filtered = alerts.filter(a =>
    Object.values(a).some(v =>
      String(v).toLowerCase().includes(search)
    )
  );

  renderAlerts(filtered);
}

async function loadAlerts() {
  try {
    alerts = await apiFetch("/api/alerts");
    renderAlerts(alerts);
  } catch (e) {
    alertsList.innerHTML = `<div class="table-row"><div></div><div>Erreur</div></div>`;
  }
}

async function resolveSelectedAlerts() {
  const selected = [...document.querySelectorAll(".alert-checkbox:checked")]
    .map(c => c.value);

  for (const id of selected) {
    await apiFetch(`/api/alerts/${id}/resolve`, { method: "PATCH" });
  }

  loadAlerts();
}

selectAllCheckbox.addEventListener("change", () => {
  document.querySelectorAll(".alert-checkbox").forEach(cb => {
    cb.checked = selectAllCheckbox.checked;
  });
});

searchInput.addEventListener("input", filterAlerts);
resolveSelectedButton.addEventListener("click", resolveSelectedAlerts);

checkAuthentication();
loadAlerts();