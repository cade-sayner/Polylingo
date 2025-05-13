import { applicationUri } from "./constants";
import { loadLandingPage } from "./pages/landing";
import { loadUserLandingPage } from "./pages/user-landing";
import { loadInstructorLandingPage } from "./pages/instructor-landing";
import { FillBlankExercisePage} from "./pages/fill-blank";
import { TranslationExercisePage } from "./pages/translation-page";
import { BasePage } from "./types";
import { LoginPage } from "./pages/login";

// const routes: Record<string, RouteDefinition> = {
//     '/login': { content: () => document.querySelector(".login-screen-template")?.innerHTML, loadCallback: loadLoginPage },
//     '/landing/user': { content: () => document.querySelector(".landing-page-template")?.innerHTML, loadCallback: loadUserLandingPage },
//     '/landing/instructor': { content: () => document.querySelector(".instructor-landing-page-template")?.innerHTML, loadCallback: loadInstructorLandingPage },
//     '/': { content: () => document.querySelector(".loadingLandingPageTemplate")?.innerHTML, loadCallback: loadLandingPage },
//     '/exercise/fill-blank': { content: () => document.querySelector(".fill-blank-template")?.innerHTML, loadCallback: loadFillBlankExercise }
// }

const routes : Record<string, BasePage> = {
    '/exercise/fill-blank' : new FillBlankExercisePage(),
    '/login' : new LoginPage(),
    '/exercise/translate' : new TranslationExercisePage()
}

export function render(path: string) {
  console.log(path);
  console.log(routes[path]);
    const pageContent = routes[path]?.render() ?? "<section> 404 not found </section>";
    console.log(pageContent);
    let pageContainer = document.querySelector(".page-container");
    if (pageContainer) {
      pageContainer.innerHTML = pageContent;
      console.log("Finished navigating");
    }
    routes[path].load();
  }
  
export function navigateTo(path: string) {
    history.pushState({}, '', `${applicationUri}${path}`);
    render(path);
}

