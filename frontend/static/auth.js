import { apiFetch } from "./api.js";

const form = document.querySelector("#login-form");
const emailInput = document.querySelector("#email-input");
const passwordInput = document.querySelector("#password-input");
const errorMessage = document.querySelector("#error-message");
const loginButton = document.querySelector("#login-button");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  errorMessage.textContent = "";

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    errorMessage.textContent = "Veuillez remplir tous les champs.";
    return;
  }

  try {
    loginButton.disabled = true;
    loginButton.textContent = "Connexion...";

    const data = await apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!data.token) {
      throw new Error("Token manquant dans la réponse du serveur.");
    }

    localStorage.setItem("token", data.token);

    window.location.href = "./dashboard.html";
  } catch (error) {
    errorMessage.textContent =
      error.message || "Impossible de se connecter.";
  } finally {
    loginButton.disabled = false;
    loginButton.textContent = "Sign In";
  }
});