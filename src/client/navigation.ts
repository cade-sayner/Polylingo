import { applicationUri } from "./constants";
import { FillBlankExercisePage} from "./pages/fill-blank";
import { InstructorCreatePage } from "./pages/instructor-page";
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
    '/instructor/create' : new InstructorCreatePage(),
    '/landing' : new LandingPage(),
    '/landing/user' : new UserLandingPage(),
    '/landing/instructor' : new InstructorLandingPage()
}

export function render(path: string) {
    const pageContent = routes[path]?.render() ?? "<section> 404 not found </section>";
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
  
export function navigateTo(path: string) {
    history.pushState({}, '', `${applicationUri}${path}`);
    render(path);
}

(window as any).navigateTo = navigateTo;

