import { apiFetch } from "./api.js";

const clientsList = document.querySelector("#clients-list");
const searchInput = document.querySelector("#client-search");
const displayCount = document.querySelector("#display-count");
const newClientButton = document.querySelector("#new-client-btn");

let clients = [];

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

function getInitials(name) {
  return String(name || "C")
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function createClientRow(client) {
  const name = escapeHtml(client.name || "Client sans nom");
  const initials = escapeHtml(getInitials(client.name));
  const phone = escapeHtml(client.phone || "Ajouter un téléphone");
  const address = escapeHtml(client.address || "Adresse à compléter");
  const contact = escapeHtml(client.contact || "Créer un contact");

  return `
    <div class="table-row">
      <div>
        <input type="checkbox" value="${escapeHtml(client.client_id)}">
      </div>

      <div class="client-name">
        <span class="client-logo">${initials}</span>
        <span>${name}</span>
      </div>

      <div class="muted">0</div>

      <div class="muted">${phone}</div>

      <div class="muted">${address}</div>

      <div>
        <a href="#" class="contact-link">${contact}</a>
      </div>

      <div>
        <button class="rank-btn" type="button">Set rank</button>
      </div>
    </div>
  `;
}

function renderClients(clientsToRender) {
  if (!Array.isArray(clientsToRender) || clientsToRender.length === 0) {
    clientsList.innerHTML = `
      <div class="table-row">
        <div></div>
        <div>Aucun client trouvé.</div>
      </div>
    `;

    displayCount.textContent = "Affichage de 0 client";
    return;
  }

  clientsList.innerHTML = clientsToRender.map(createClientRow).join("");

  displayCount.textContent = `Affichage de ${clientsToRender.length} client${
    clientsToRender.length > 1 ? "s" : ""
  }`;
}

function filterClients() {
  const search = searchInput.value.trim().toLowerCase();

  const filteredClients = clients.filter((client) => {
    return [
      client.name,
      client.phone,
      client.address,
      client.contact,
    ]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(search));
  });

  renderClients(filteredClients);
}

async function loadClients() {
  try {
    clientsList.innerHTML = `
      <div class="table-row">
        <div></div>
        <div>Chargement des clients...</div>
      </div>
    `;

    const data = await apiFetch("/api/clients");
    clients = Array.isArray(data) ? data : data.clients || [];

    renderClients(clients);
  } catch (error) {
    clientsList.innerHTML = `
      <div class="table-row">
        <div></div>
        <div>Impossible de charger les clients : ${escapeHtml(error.message)}</div>
      </div>
    `;
  }
}

newClientButton.addEventListener("click", async () => {
  const name = prompt("Nom du nouveau client :");

  if (!name || !name.trim()) return;

  try {
    await apiFetch("/api/clients", {
      method: "POST",
      body: JSON.stringify({
        name: name.trim(),
        address: "Adresse à compléter",
        phone: "06 00 00 00 00",
        contact: "Contact à définir",
      }),
    });

    await loadClients();
  } catch (error) {
    alert(error.message || "Impossible de créer le client.");
  }
});

searchInput.addEventListener("input", filterClients);

checkAuthentication();
loadClients();