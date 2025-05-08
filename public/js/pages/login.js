import { googleAuthURI } from "../constants";
export function loadLoginPage() {
    const loginButton = document.querySelector(".login-button");
    loginButton === null || loginButton === void 0 ? void 0 : loginButton.addEventListener('click', () => {
        window.location.href = googleAuthURI;
    });
}
