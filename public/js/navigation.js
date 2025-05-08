import { applicationUri } from "./constants";
import { loadLoginPage } from "./pages/login";
import { loadLandingPage } from "./pages/landing";
import { loadUserLandingPage } from "./pages/user-landing";
import { loadInstructorLandingPage } from "./pages/instructor-landing";
import { loadFillBlankExercise } from "./pages/fill-blank";
const routes = {
    '/login': { content: () => { var _a; return (_a = document.querySelector(".login-screen-template")) === null || _a === void 0 ? void 0 : _a.innerHTML; }, loadCallback: loadLoginPage },
    '/landing/user': { content: () => { var _a; return (_a = document.querySelector(".landing-page-template")) === null || _a === void 0 ? void 0 : _a.innerHTML; }, loadCallback: loadUserLandingPage },
    '/landing/instructor': { content: () => { var _a; return (_a = document.querySelector(".instructor-landing-page-template")) === null || _a === void 0 ? void 0 : _a.innerHTML; }, loadCallback: loadInstructorLandingPage },
    '/': { content: () => { var _a; return (_a = document.querySelector(".loadingLandingPageTemplate")) === null || _a === void 0 ? void 0 : _a.innerHTML; }, loadCallback: loadLandingPage },
    '/exercise/fill-blank': { content: () => { var _a; return (_a = document.querySelector(".fill-blank-template")) === null || _a === void 0 ? void 0 : _a.innerHTML; }, loadCallback: loadFillBlankExercise }
};
export function render(path) {
    var _a, _b;
    const pageContent = (_b = (_a = routes[path]) === null || _a === void 0 ? void 0 : _a.content()) !== null && _b !== void 0 ? _b : "<section> 404 not found </section>";
    let pageContainer = document.querySelector(".page-container");
    if (pageContainer) {
        pageContainer.innerHTML = pageContent;
    }
    routes[path].loadCallback();
}
export function navigateTo(path) {
    history.pushState({}, '', `${applicationUri}${path}`);
    render(path);
}
