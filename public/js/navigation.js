import { applicationUri } from "./constants";
import { FillBlankExercisePage } from "./pages/fill-blank";
import { TranslationExercisePage } from "./pages/translation-page";
import { LoginPage } from "./pages/login";
import { UserLandingPage } from "./pages/user-landing";
import { InstructorLandingPage } from "./pages/instructor-landing";
import { LandingPage } from "./pages/landing";
const routes = {
    '/exercise/fill-blank': new FillBlankExercisePage(),
    '/login': new LoginPage(),
    '/exercise/translate': new TranslationExercisePage(),
    '/landing': new LandingPage(),
    '/landing/user': new UserLandingPage(),
    '/landing/instructor': new InstructorLandingPage()
};
export function render(path) {
    var _a, _b;
    const pageContent = (_b = (_a = routes[path]) === null || _a === void 0 ? void 0 : _a.render()) !== null && _b !== void 0 ? _b : "<section> 404 not found </section>";
    let pageContainer = document.querySelector(".page-container");
    if (pageContainer) {
        const template = document.createElement("template");
        template.innerHTML = pageContent.trim();
        const content = template.content.cloneNode(true);
        pageContainer.replaceChildren(content);
        pageContainer.replaceChildren(template.content.cloneNode(true));
    }
    routes[path].load();
}
export function navigateTo(path) {
    history.pushState({}, '', `${applicationUri}${path}`);
    render(path);
}
window.navigateTo = navigateTo;
