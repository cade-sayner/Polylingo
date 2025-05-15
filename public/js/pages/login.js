import { Navbar } from "../components/navbar";
import { googleAuthURI } from "../constants";
export class LoginPage {
    render() {
        return [
            new Navbar(false).render(),
            document.querySelector("#login-template").content.cloneNode(true)
        ];
    }
    load() {
        const loginButton = document.querySelector(".login-button");
        loginButton === null || loginButton === void 0 ? void 0 : loginButton.addEventListener('click', () => {
            window.location.href = googleAuthURI;
        });
    }
}
