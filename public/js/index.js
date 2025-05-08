"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const routes = {
    '/login': { content: () => { var _a; return (_a = document.querySelector(".login-screen-template")) === null || _a === void 0 ? void 0 : _a.innerHTML; }, loadCallback: loadLoginPage },
    '/landing/user': { content: () => { var _a; return (_a = document.querySelector(".landing-page-template")) === null || _a === void 0 ? void 0 : _a.innerHTML; }, loadCallback: loadUserLandingPage },
    '/landing/instructor': { content: () => { var _a; return (_a = document.querySelector(".instructor-landing-page-template")) === null || _a === void 0 ? void 0 : _a.innerHTML; }, loadCallback: loadInstructorLandingPage },
    '/': { content: () => { var _a; return (_a = document.querySelector(".loadingLandingPageTemplate")) === null || _a === void 0 ? void 0 : _a.innerHTML; }, loadCallback: loadLandingPage }
};
// move these to a constants module at some point?
const googleAuthURI = "https://accounts.google.com/o/oauth2/auth?client_id=1090642996208-ohdh4ge7agbi5egf22j3qapf2q3ko16a.apps.googleusercontent.com&redirect_uri=http://localhost:3000/login.html&response_type=code&scope=openid%20phone%20email%20profile";
const API_BASE_URL = "http://localhost:3000";
const applicationUri = "http://localhost:3000";
function render(path) {
    var _a, _b;
    const pageContent = (_b = (_a = routes[path]) === null || _a === void 0 ? void 0 : _a.content()) !== null && _b !== void 0 ? _b : "<section> 404 not found </section>";
    let pageContainer = document.querySelector(".page-container");
    if (pageContainer) {
        pageContainer.innerHTML = pageContent;
    }
    routes[path].loadCallback();
}
function navigateTo(path) {
    history.pushState({}, '', `${applicationUri}${path}`);
    render(path);
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
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
    });
}
function loadLoginPage() {
    const loginButton = document.querySelector(".login-button");
    loginButton === null || loginButton === void 0 ? void 0 : loginButton.addEventListener('click', () => {
        window.location.href = googleAuthURI;
    });
}
function loadLandingPage() {
    return __awaiter(this, void 0, void 0, function* () {
        let role = yield apiFetch("/api/users/role");
        if (role.role == "USER") {
            navigateTo("/landing/user");
            return;
        }
        if (role.role == "INSTRUCTOR") {
            navigateTo("/landing/instructor");
        }
    });
}
function loadUserLandingPage() {
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
let token = null;
function setToken(newToken) {
    token = newToken;
}
function apiFetch(path_1) {
    return __awaiter(this, arguments, void 0, function* (path, options = {}) {
        const headers = Object.assign(Object.assign({}, (options.headers || {})), { Authorization: token ? `Bearer ${token}` : "", "Content-Type": "application/json" });
        const response = yield fetch(`${API_BASE_URL}${path}`, Object.assign(Object.assign({}, options), { headers }));
        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}, Message: ${(yield response.json()).message}`);
        }
        return response.json();
    });
}
document.addEventListener("DOMContentLoaded", () => {
    main();
});
