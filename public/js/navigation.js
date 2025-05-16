import { applicationUri } from "./constants";
import { FillBlankExercisePage } from "./pages/fill-blank";
import { InstructorCreatePage } from "./pages/instructor-page";
import { TranslationExercisePage } from "./pages/translation-page";
import { LoginPage } from "./pages/login";
import { UserLandingPage } from "./pages/user-landing";
import { InstructorLandingPage } from "./pages/instructor-landing";
import { LandingPage } from "./pages/landing";
const routes = {
    '/exercise/fill-blank': new FillBlankExercisePage(),
    '/login': new LoginPage(),
    '/exercise/translate': new TranslationExercisePage(),
    '/instructor/dashboard': new InstructorCreatePage(),
    '/landing': new LandingPage(),
    '/landing/user': new UserLandingPage(),
    '/landing/instructor': new InstructorLandingPage()
};
export function render(path) {
    var _a, _b;
    const pageContent = (_b = (_a = routes[path]) === null || _a === void 0 ? void 0 : _a.render()) !== null && _b !== void 0 ? _b : "404";
    let pageContainer = document.querySelector(".page-container");
    if (pageContainer) {
        if (path === '/instructor/dashboard') {
            pageContainer.innerHTML = routes[path].render();
        }
        else {
            pageContainer.replaceChildren();
            pageContainer.append(...pageContent);
        }
    }
    routes[path].load();
}
export function navigateTo(path) {
    history.pushState({}, '', `${applicationUri}${path}`);
    render(path);
}
window.navigateTo = navigateTo;
