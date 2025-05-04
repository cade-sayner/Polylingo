"use strict";
// Find a way to write a proper type for this
const routes = {
    'login': { content: () => { var _a; return (_a = document.querySelector(".login-screen-template")) === null || _a === void 0 ? void 0 : _a.innerHTML; }, loadCallback: loadLoginPage },
    'landing': { content: () => { var _a; return (_a = document.querySelector(".landing-page-template")) === null || _a === void 0 ? void 0 : _a.innerHTML; }, loadCallback: loadLandingPage }
};
// move these to a constants module at some point
const applicationUri = "http://localhost:3000";
const googleAuthURI = "https://accounts.google.com/o/oauth2/auth?client_id=988182050054-vlcub1cr22892gc1e4uesj5d6sa3ji1v.apps.googleusercontent.com&redirect_uri=http://localhost:3000/login.html&response_type=code&scope=openid%20phone%20email%20profile";
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
    history.pushState({}, '', `${applicationUri}/${path}`);
    render(path);
}
function main() {
    // check if the user is currently logged in, if they are not then navigate to the login screen
    const jwt = localStorage.getItem("polylingo_jwt");
    // TODO: actually validate the jwt, check the expiry etc. Just checking for existence for now
    if (jwt !== null) {
        navigateTo("landing");
        return;
    }
    navigateTo("login");
}
function loadLoginPage() {
    // subscribe all event listeners
    const loginButton = document.querySelector(".login-button");
    loginButton === null || loginButton === void 0 ? void 0 : loginButton.addEventListener('click', () => {
        // redirect to google
        window.location.href = googleAuthURI;
    });
}
function loadLandingPage() {
    // subscribe all event listeners for the landing page
    // check roles and based on roles decide that the admin roles should be shown for instance  
}
function loadAdminPage() {
}
function loadTranslationPage() {
}
function loadFillBlankPage() {
}
main();
