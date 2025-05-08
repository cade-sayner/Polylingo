import { googleAuthURI } from "../constants";

export function loadLoginPage() {
    const loginButton = document.querySelector(".login-button");
    loginButton?.addEventListener('click', () => {
      window.location.href = googleAuthURI;
    })
}