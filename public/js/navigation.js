import { applicationUri } from "./constants";
import { FillBlankExercisePage } from "./pages/fill-blank";
import { TranslationExercisePage } from "./pages/translation-page";
import { LoginPage } from "./pages/login";
import { UserLandingPage } from "./pages/user-landing";
import { InstructorLandingPage } from "./pages/instructor-landing";
// const routes: Record<string, RouteDefinition> = {
//     '/login': { content: () => document.querySelector(".login-screen-template")?.innerHTML, loadCallback: loadLoginPage },
//     '/landing/user': { content: () => document.querySelector(".landing-page-template")?.innerHTML, loadCallback: loadUserLandingPage },
//     '/landing/instructor': { content: () => document.querySelector(".instructor-landing-page-template")?.innerHTML, loadCallback: loadInstructorLandingPage },
//     '/': { content: () => document.querySelector(".loadingLandingPageTemplate")?.innerHTML, loadCallback: loadLandingPage },
//     '/exercise/fill-blank': { content: () => document.querySelector(".fill-blank-template")?.innerHTML, loadCallback: loadFillBlankExercise }
// }
const routes = {
    '/exercise/fill-blank': new FillBlankExercisePage(),
    '/login': new LoginPage(),
    '/exercise/translate': new TranslationExercisePage(),
    '/landing/user': new UserLandingPage(),
    '/landing/instructor': new InstructorLandingPage()
};
export function render(path) {
    var _a, _b;
    const pageContent = (_b = (_a = routes[path]) === null || _a === void 0 ? void 0 : _a.render()) !== null && _b !== void 0 ? _b : "<section> 404 not found </section>";
    console.log(pageContent);
    let pageContainer = document.querySelector(".page-container");
    if (pageContainer) {
        pageContainer.innerHTML = pageContent;
    }
    routes[path].load();
}
export function navigateTo(path) {
    history.pushState({}, '', `${applicationUri}${path}`);
    render(path);
}
window.navigateTo = navigateTo;
