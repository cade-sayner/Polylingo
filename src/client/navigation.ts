import { applicationUri } from "./constants";
import { FillBlankExercisePage} from "./pages/fill-blank";
import { TranslationExercisePage } from "./pages/translation-page";
import { BasePage } from "./types";
import { LoginPage } from "./pages/login";
import { UserLandingPage } from "./pages/user-landing";
import { InstructorLandingPage } from "./pages/instructor-landing";
import { LandingPage } from "./pages/landing";

const routes : Record<string, BasePage> = {
    '/exercise/fill-blank' : new FillBlankExercisePage(),
    '/login' : new LoginPage(),
    '/exercise/translate' : new TranslationExercisePage(),
    '/landing' : new LandingPage(),
    '/landing/user' : new UserLandingPage(),
    '/landing/instructor' : new InstructorLandingPage()
}

export function render(path: string) {
    const pageContent = routes[path]?.render() ?? "404";
    let pageContainer = document.querySelector(".page-container") as HTMLElement;
    if (pageContainer) {
      pageContainer.replaceChildren();
      pageContainer.append(...pageContent as HTMLElement[]);
    }
    routes[path].load();
  }
  
export function navigateTo(path: string) {
    history.pushState({}, '', `${applicationUri}${path}`);
    render(path);
}

(window as any).navigateTo = navigateTo;

