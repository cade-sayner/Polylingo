import { applicationUri } from "./constants";
import { loadLoginPage } from "./pages/login";
import { loadLandingPage } from "./pages/landing";
import { loadUserLandingPage } from "./pages/user-landing";
import { loadInstructorLandingPage } from "./pages/instructor-landing";
import { loadFillBlankExercise } from "./pages/fill-blank";
import { RouteDefinition } from "./types";

const routes: Record<string, RouteDefinition> = {
    '/login': { content: () => document.querySelector(".login-screen-template")?.innerHTML, loadCallback: loadLoginPage },
    '/landing/user': { content: () => document.querySelector(".landing-page-template")?.innerHTML, loadCallback: loadUserLandingPage },
    '/landing/instructor': { content: () => document.querySelector(".instructor-landing-page-template")?.innerHTML, loadCallback: loadInstructorLandingPage },
    '/': { content: () => document.querySelector(".loadingLandingPageTemplate")?.innerHTML, loadCallback: loadLandingPage },
    '/exercise/fill-blank': { content: () => document.querySelector(".fill-blank-template")?.innerHTML, loadCallback: loadFillBlankExercise }
}

export function render(path: string) {
    const pageContent = routes[path]?.content() ?? "<section> 404 not found </section>";
    let pageContainer = document.querySelector(".page-container");
    if (pageContainer) {
      pageContainer.innerHTML = pageContent;
    }
    routes[path].loadCallback();
  }
  
export function navigateTo(path: string) {
    history.pushState({}, '', `${applicationUri}${path}`);
    render(path);
}

