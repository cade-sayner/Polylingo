const routes: Record<string, RouteDefinition> = {
  'login': { content: () => document.querySelector(".login-screen-template")?.innerHTML, loadCallback: loadLoginPage },
  'landing/user': { content: () => document.querySelector(".landing-page-template")?.innerHTML, loadCallback: loadLandingPage },
  'landing/instructor': { content: () => document.querySelector(".instructor-landing-page-template")?.innerHTML, loadCallback: loadInstructorLandingPage }

}

// move these to a constants module at some point?
const googleAuthURI = "https://accounts.google.com/o/oauth2/auth?client_id=988182050054-vlcub1cr22892gc1e4uesj5d6sa3ji1v.apps.googleusercontent.com&redirect_uri=http://localhost:3000/login.html&response_type=code&scope=openid%20phone%20email%20profile";
const API_BASE_URL = "http://localhost:3000";
const applicationUri = "http://localhost:3000";

function render(path: string) {
  const pageContent = routes[path]?.content() ?? "<section> 404 not found </section>";
  let pageContainer = document.querySelector(".page-container");
  if (pageContainer) {
    pageContainer.innerHTML = pageContent;
  }
  routes[path].loadCallback();
}

function navigateTo(path: string) {
  history.pushState({}, '', `${applicationUri}/${path}`);
  render(path);
}

async function main() {
  // check if the user is currently logged in, if they are not then navigate to the login screen
  const jwt = localStorage.getItem("polylingo_jwt");
  // TODO: actually validate the jwt, check the expiry etc. Just checking for existence for now
  if (jwt !== null) {
    setToken(jwt);
    // TODO: Move common types into a shared library
    let role = await apiFetch("/api/users/role") as Role;
    if (role.role == "USER") {
      navigateTo("landing/user");
      return
    }
    if (role.role == "INSTRUCTOR") {
      navigateTo("landing/instructor")
    }

    return;
  }

  navigateTo("login");
}

function loadLoginPage() {
  const loginButton = document.querySelector(".login-button");
  loginButton?.addEventListener('click', () => {
    window.location.href = googleAuthURI;
  })
}

function loadLandingPage() {
  // subscribe all event listeners for the landing page
}

function loadInstructorLandingPage() {

}

function loadAdminPage() {

}

function loadTranslationPage() {

}

function loadFillBlankPage() {

}

// API client
//--------------------------------------------------------------------------------------------------------------------------
let token: string | null = null;

function setToken(newToken: string) {
  token = newToken;
}

async function apiFetch(path: string, options: RequestInit = {}) {
  const headers: HeadersInit = {
    ...(options.headers || {}),
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}, Message: ${(await response.json() as { message: string }).message}`);
  }
  return response.json();
}

main();

// Types
//--------------------------------------------------------------------------------------------------------------------------------
type User = {
  userId: number | null;
  googleId: string;
  email: string;
  name: string;
  roleId: number;
};

type Role = {
  id: number | null;
  role: "USER" | "INSTRUCTOR";
}

interface RouteDefinition {
  content: () => string | undefined;
  loadCallback: () => void;
}

