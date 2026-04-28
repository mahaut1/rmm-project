import { apiFetch } from "./api.js";

const form = document.querySelector("#ticket-form");
const customerSelect = document.querySelector("#customer-select");
const customerDisplay = document.querySelector("#customer-display");
const agentSelect = document.querySelector("#agent-select");

const ticketTitle = document.querySelector("#ticket-title");
const ticketDescription = document.querySelector("#ticket-description");
const ticketType = document.querySelector("#ticket-type");
const prioritySelect = document.querySelector("#priority-select");
const impactSelect = document.querySelector("#impact-select");
const contactInput = document.querySelector("#contact-input");
const startDate = document.querySelector("#start-date");
const endDate = document.querySelector("#end-date");

const createButton = document.querySelector("#create-ticket-btn");
const cancelButton = document.querySelector("#cancel-btn");

function checkAuthentication() {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "./connexion.html";
  }
}

function addOption(selectElement, value, label) {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = label;
  selectElement.appendChild(option);
}

async function loadClients() {
  const clients = await apiFetch("/api/clients");

  clients.forEach((client) => {
    addOption(customerSelect, client.client_id, client.name);
  });
}

async function loadAgents() {
  const agents = await apiFetch("/api/agents");

  agents.forEach((agent) => {
    const label = agent.os
      ? `${agent.hostname} (${agent.os})`
      : agent.hostname;

    addOption(agentSelect, agent.agent_id, label);
  });
}

customerSelect.addEventListener("change", () => {
  const selectedOption = customerSelect.options[customerSelect.selectedIndex];
  customerDisplay.value = selectedOption?.textContent || "";
});

cancelButton.addEventListener("click", () => {
  window.location.href = "./ticket-dashboard/ticket-dashboard.html";
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const selectedClientId = customerSelect.value;
  const selectedAgentId = agentSelect.value;

  if (!selectedClientId) {
    alert("Veuillez sélectionner un client.");
    return;
  }

  if (!selectedAgentId) {
    alert("Veuillez sélectionner un agent.");
    return;
  }

  if (!ticketTitle.value.trim()) {
    alert("Veuillez saisir un titre.");
    return;
  }

  try {
    createButton.disabled = true;
    createButton.textContent = "création...";

    await apiFetch("/api/actions", {
      method: "POST",
      body: JSON.stringify({
        agent_id: selectedAgentId,
        type: ticketType.value,
        payload: {
          client_id: selectedClientId,
          title: ticketTitle.value.trim(),
          description: ticketDescription.value.trim(),
          priority: prioritySelect.value,
          impact: impactSelect.value,
          contact: contactInput.value.trim() || null,
          start_date: startDate.value || null,
          end_date: endDate.value || null,
        },
      }),
    });

    alert("Ticket créé avec succès.");
    window.location.href = "./ticket-dashboard/ticket-dashboard.html";
  } catch (error) {
    alert(error.message || "Impossible de créer le ticket.");
  } finally {
    createButton.disabled = false;
    createButton.textContent = "create";
  }
});

checkAuthentication();
loadClients();
loadAgents();