import { Navbar } from "../components/navbar";
import { googleAuthURI } from "../constants";
import { BasePage } from "../types";


export class LoginPage implements BasePage{
  render(){
    return `
    ${new Navbar(false).render()}
    ${document.querySelector("#login-template")?.innerHTML}
    `
  }
  load() {
      const loginButton = document.querySelector(".login-button");
      loginButton?.addEventListener('click', () => {
        window.location.href = googleAuthURI;
      })
  }
}