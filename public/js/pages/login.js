import { Navbar } from "../components/navbar";
import { googleAuthURI } from "../constants";
export class LoginPage {
    render() {
        var _a;
        return `
    ${(new Navbar(false)).render()}
    ${(_a = document.querySelector("#login-template")) === null || _a === void 0 ? void 0 : _a.innerHTML}
    `;
    }
    load() {
        const loginButton = document.querySelector(".login-button");
        loginButton === null || loginButton === void 0 ? void 0 : loginButton.addEventListener('click', () => {
            window.location.href = googleAuthURI;
        });
    }
}
