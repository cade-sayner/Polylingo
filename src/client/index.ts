
import { navigateTo } from "./navigation";
import { setToken } from "./api-client";


async function main() {
  // check if the user is currently logged in, if they are not then navigate to the login screen
  const jwt = localStorage.getItem("polylingo_jwt");
  // TODO: actually validate the jwt, check the expiry etc. Just checking for existence for now
  if (jwt !== null) {
    setToken(jwt);
    // someone is logged in
    // take them where they want to go
    navigateTo(window.location.pathname);
    return;
  }
  navigateTo("/login");
}

document.addEventListener("DOMContentLoaded", () => {
  main();
});




