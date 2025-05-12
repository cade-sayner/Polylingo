import { applicationUri } from "./constants";
import { FillBlankExercisePage } from "./pages/fill-blank";
import { LoginPage } from "./pages/login";
// const routes: Record<string, RouteDefinition> = {
//     '/login': { content: () => document.querySelector(".login-screen-template")?.innerHTML, loadCallback: loadLoginPage },
//     '/landing/user': { content: () => document.querySelector(".landing-page-template")?.innerHTML, loadCallback: loadUserLandingPage },
//     '/landing/instructor': { content: () => document.querySelector(".instructor-landing-page-template")?.innerHTML, loadCallback: loadInstructorLandingPage },
//     '/': { content: () => document.querySelector(".loadingLandingPageTemplate")?.innerHTML, loadCallback: loadLandingPage },
//     '/exercise/fill-blank': { content: () => document.querySelector(".fill-blank-template")?.innerHTML, loadCallback: loadFillBlankExercise }
// }
const routes = {
    '/exercise/fill-blank': new FillBlankExercisePage(),
    '/login': new LoginPage()
};
export function render(path) {
    var _a, _b;
    const pageContent = (_b = (_a = routes[path]) === null || _a === void 0 ? void 0 : _a.render()) !== null && _b !== void 0 ? _b : "<section> 404 not found </section>";
    console.log(pageContent);
    let pageContainer = document.querySelector(".page-container");
    if (pageContainer) {
        pageContainer.innerHTML = pageContent;
        console.log("Finished navigating");
    }
    routes[path].load();
}
export function navigateTo(path) {
    history.pushState({}, '', `${applicationUri}${path}`);
    render(path);
}
