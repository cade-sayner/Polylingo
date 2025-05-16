import { applicationUri } from "./constants";
import { FillBlankExercisePage} from "./pages/fill-blank";
import { InstructorCreatePage } from "./pages/instructor-page";
import { TranslationExercisePage } from "./pages/translation-page";
import { BaseInstructorPage, BasePage } from "./types";
import { LoginPage } from "./pages/login";
import { UserLandingPage } from "./pages/user-landing";
import { LandingPage } from "./pages/landing";

const routes : Record<string, BasePage | BaseInstructorPage> = {
    '/exercise/fill-blank' : new FillBlankExercisePage(),
    '/login' : new LoginPage(),
    '/exercise/translate' : new TranslationExercisePage(),
    '/instructor/dashboard' : new InstructorCreatePage(),
    '/landing' : new LandingPage(),
    '/landing/user' : new UserLandingPage()
}

export function render(path: string) {
    const pageContent = routes[path]?.render() ?? "404";
    let pageContainer = document.querySelector(".page-container") as HTMLElement;
    if (pageContainer) {
      if (path === '/instructor/dashboard'){
        pageContainer.innerHTML = (routes[path] as BaseInstructorPage).render();
      }
      else{
        pageContainer.replaceChildren();
        pageContainer.append(...pageContent as HTMLElement[]);
      }
      
    }
    routes[path].load();
  }
  
export function navigateTo(path: string) {
    history.pushState({}, '', `${applicationUri}${path}`);
    render(path);
}

(window as any).navigateTo = navigateTo;

window.addEventListener('popstate', () => {
  render(window.location.pathname.replace(applicationUri, ''));
});