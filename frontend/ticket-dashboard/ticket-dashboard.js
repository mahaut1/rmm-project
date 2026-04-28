import { apiFetch } from "../static/api.js";

const ticketsList = document.querySelector("#tickets-list");
const newTicketButton = document.querySelector("#new-ticket-btn");
const searchInput = document.querySelector("#ticket-search");
const displayCount = document.querySelector("#display-count");

let tickets = [];

function checkAuthentication() {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "../connexion.html";
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

function shortId(id) {
  if (!id) return "#----";
  return `#${id.slice(0, 8)}`;
}

function getStatusLabel(status) {
  const labels = {
    open: "Open",
    in_progress: "In progress",
    resolved: "Resolved",
    closed: "Closed",
  };

  return labels[status] || status || "Open";
}

function getPriorityLabel(priority) {
  const labels = {
    low: "Low",
    medium: "Medium",
    high: "High",
    critical: "Critical",
  };

  return labels[priority] || priority || "Medium";
}

function getSentiment(priority) {
  if (priority === "critical") return "🙁";
  if (priority === "high") return "😐";
  return "🙂";
}

function getSentimentClass(priority) {
  if (priority === "critical") return "sad";
  if (priority === "high") return "neutral";
  return "happy";
}

function getStatusClass(status) {
  if (status === "resolved" || status === "closed") return "resolved";
  if (status === "in_progress") return "progress";
  return "open";
}

function getActivityLabel(status) {
  if (status === "resolved" || status === "closed") return "Done";
  if (status === "in_progress") return "In progress";
  return "Read";
}

function getInitials(value) {
  if (!value) return "NA";

  const cleanValue = String(value).split("@")[0];

  return cleanValue
    .split(/[\s._-]+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function createHeaderRow() {
  return `
    <div class="list-row header-row">
      <div class="col-check"></div>
      <div class="col-logo"></div>
      <div class="col-details">Details</div>
      <div class="col-sla">SLA</div>
      <div class="col-sentiment">Sentiment</div>
      <div class="col-assignee">Assigned technician</div>
      <div class="col-priority">Priority</div>
      <div class="col-activity">Activity status</div>
      <div class="col-status">Status</div>
    </div>
  `;
}

function createTicketRow(ticket, index) {
  const title = escapeHtml(ticket.title || "Ticket sans titre");
  const ticketId = escapeHtml(shortId(ticket.ticket_id));
  const clientName = escapeHtml(ticket.client_name || "Client inconnu");
  const contact = escapeHtml(ticket.contact || "Contact non renseigné");

  const createdAt = formatDate(ticket.created_at);
  const updatedAt = formatDate(ticket.updated_at);

  const priority = escapeHtml(getPriorityLabel(ticket.priority));
  const status = escapeHtml(getStatusLabel(ticket.status));
  const statusClass = escapeHtml(getStatusClass(ticket.status));

  const sentiment = getSentiment(ticket.priority);
  const sentimentClass = escapeHtml(getSentimentClass(ticket.priority));
  const activity = escapeHtml(getActivityLabel(ticket.status));

  const technicianName = escapeHtml(
    ticket.technician_name || ticket.technician_email || "Non assigné"
  );

  const initials = escapeHtml(
    getInitials(ticket.technician_name || ticket.technician_email || "NA")
  );

  const concernedDevice = ticket.agent_hostname
    ? `${escapeHtml(ticket.agent_hostname)} ${
        ticket.agent_os ? `(${escapeHtml(ticket.agent_os)})` : ""
      }`
    : "Aucun appareil";

  const logoClass = index % 2 === 0 ? "blue-circle" : "dell";
  const logoIcon = index % 2 === 0 ? "fa-hurricane" : "fa-laptop";

  return `
    <div class="list-row">
      <div class="col-check">
        <input type="checkbox" class="custom-checkbox" value="${escapeHtml(ticket.ticket_id)}" />
      </div>

      <div class="col-logo">
        <div class="company-logo ${logoClass}">
          <i class="fa-solid ${logoIcon}"></i>
        </div>
      </div>

      <div class="col-details">
        <div class="ticket-title">
          <span class="ticket-id">${ticketId}</span> ${title}
        </div>

        <div class="ticket-meta">
          <span class="location">${clientName}</span>
          <span class="author">${contact}</span>
        </div>

        <div class="ticket-time">
          Créé le ${createdAt}
          <span class="badge-time">Modifié le ${updatedAt}</span>
        </div>
      </div>

      <div class="col-sla">
        <span class="badge-sla">NOSLAN</span>
      </div>

      <div class="col-sentiment">
        <span class="emoji ${sentimentClass}">${sentiment}</span>
      </div>

      <div class="col-assignee">
        <div class="assignee">
          <span class="avatar-text">${initials}</span>

          <div class="assignee-info">
            <span class="name">
              ${technicianName} <i class="fa-solid fa-chevron-down"></i>
            </span>

            <span class="status-badge online">${concernedDevice}</span>
          </div>
        </div>
      </div>

      <div class="col-priority">
        ${priority} <i class="fa-solid fa-chevron-down"></i>
      </div>

      <div class="col-activity">
        <span class="dot read"></span> ${activity}
        <i class="fa-solid fa-chevron-down"></i>
      </div>

      <div class="col-status">
        <span class="badge-status ${statusClass}">
          ${status} <i class="fa-solid fa-chevron-down"></i>
        </span>
      </div>
    </div>
  `;
}

function renderTickets(ticketsToRender) {
  if (!Array.isArray(ticketsToRender) || ticketsToRender.length === 0) {
    ticketsList.innerHTML = `
      ${createHeaderRow()}
      <div class="list-row">
        <div class="col-details">Aucun ticket trouvé.</div>
      </div>
    `;

    displayCount.textContent = `Displaying 0 of ${tickets.length}`;
    return;
  }

  ticketsList.innerHTML = `
    ${createHeaderRow()}
    ${ticketsToRender
      .map((ticket, index) => createTicketRow(ticket, index))
      .join("")}
  `;

  displayCount.textContent = `Displaying ${ticketsToRender.length} of ${tickets.length}`;
}

function filterTickets() {
  const search = searchInput.value.trim().toLowerCase();

  if (!search) {
    renderTickets(tickets);
    return;
  }

  const filteredTickets = tickets.filter((ticket) => {
    return [
      ticket.title,
      ticket.description,
      ticket.client_name,
      ticket.agent_hostname,
      ticket.agent_os,
      ticket.technician_name,
      ticket.technician_email,
      ticket.priority,
      ticket.status,
      ticket.type,
      ticket.contact,
      ticket.impact,
    ]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(search));
  });

  renderTickets(filteredTickets);
}

async function loadTickets() {
  try {
    ticketsList.innerHTML = `
      ${createHeaderRow()}
      <div class="list-row">
        <div class="col-details">Chargement des tickets...</div>
      </div>
    `;

    tickets = await apiFetch("/api/tickets");

    renderTickets(tickets);
  } catch (error) {
    ticketsList.innerHTML = `
      ${createHeaderRow()}
      <div class="list-row">
        <div class="col-details">
          Impossible de charger les tickets : ${escapeHtml(error.message)}
        </div>
      </div>
    `;
  }
}

newTicketButton.addEventListener("click", () => {
  window.location.href = "../ticket-create.html";
});

searchInput.addEventListener("input", filterTickets);

checkAuthentication();
loadTickets();