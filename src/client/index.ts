const routes: Record<string, RouteDefinition> = {
  '/login': { content: () => document.querySelector(".login-screen-template")?.innerHTML, loadCallback: loadLoginPage },
  '/landing/user': { content: () => document.querySelector(".landing-page-template")?.innerHTML, loadCallback: loadUserLandingPage },
  '/landing/instructor': { content: () => document.querySelector(".instructor-landing-page-template")?.innerHTML, loadCallback: loadInstructorLandingPage },
  '/': { content: () => document.querySelector(".loadingLandingPageTemplate")?.innerHTML, loadCallback: loadLandingPage },
  '/exercise/fill-blank': { content: () => document.querySelector(".fill-blank-template")?.innerHTML, loadCallback: loadFillBlankExercise }
}

const googleAuthURI = "https://accounts.google.com/o/oauth2/auth?client_id=988182050054-vlcub1cr22892gc1e4uesj5d6sa3ji1v.apps.googleusercontent.com&redirect_uri=http://localhost:3000/login.html&response_type=code&scope=openid%20phone%20email%20profile";
const API_BASE_URL = "http://localhost:3000";
const applicationUri = "http://localhost:3000";


function render(path: string) {

  const pageContent = routes[path]?.content() ?? "<section> 404 not found </section>";
  let pageContainer = document.querySelector(".page-container");
  if (pageContainer) {
    pageContainer.innerHTML = pageContent;
  }
  routes[path].loadCallback();
}

function navigateTo(path: string) {
  history.pushState({}, '', `${applicationUri}${path}`);
  render(path);
}

async function main() {
  // check if the user is currently logged in, if they are not then navigate to the login screen
  const jwt = localStorage.getItem("polylingo_jwt");
  // TODO: actually validate the jwt, check the expiry etc. Just checking for existence for now
  if (jwt !== null) {
    setToken(jwt);
    // someone is logged in
    // take them where they want to go
    navigateTo(window.location.pathname);
    return;
  }
  navigateTo("/login");
}

function loadLoginPage() {
  const loginButton = document.querySelector(".login-button");
  loginButton?.addEventListener('click', () => {
    window.location.href = googleAuthURI;
  })
}

async function loadLandingPage() {
  let role = await apiFetch("/api/users/role") as Role;
  if (role.role == "USER") {
    navigateTo("/landing/user");
    return
  }
  if (role.role == "INSTRUCTOR") {
    navigateTo("/landing/instructor")
  }
}

// Fill in the blank exercise 
//-------------------------------------------------------------------------------------------------------------------

class fillBlankExerciseState {
  selectedLanguage: Language;
  currentQuestion : FillBlankQuestion | undefined;
  placeholderSentenceSectionElement : HTMLSelectElement;
  optionsSectionElement : HTMLSelectElement;

  constructor() {
    this.selectedLanguage = "Afrikaans";
    this.placeholderSentenceSectionElement = document.querySelector(".placeholder-sentence") as HTMLSelectElement;
    this.optionsSectionElement = document.querySelector(".fill-blank-options") as HTMLSelectElement;
  }

  async getQuestion() {
    this.currentQuestion = await getFillBlankQuestion(this.selectedLanguage);
    this.placeholderSentenceSectionElement.innerHTML = generateInlineSentence(this.currentQuestion.placeholderSentence, this.currentQuestion.missingWord);
    this.optionsSectionElement.innerHTML = generateOptions([...this.currentQuestion.distractors, this.currentQuestion.missingWord]);
  }
}

function generateOptions(options: string[]){
  let s = options.map((word) => `<button class="fill-blank-option-word"> ${word} </button>`).join("");
  return s;
}

function generateInlineSentence(sentence : string, missingWord : string){
  return sentence.split(" ").map((word) => `<span class=${word === "___" ? "placeholder-word" : "sentence-word"}> ${word === "___" ? `<p id="missing-word-placeholder" class="missing-word">A Word</p>` : word} </span>`).join("");
}

async function loadFillBlankExercise() {
  // check that you have the user role?
  // add event listeners
  let state = new fillBlankExerciseState();
  await state.getQuestion();
  
  let languageSelect = document.querySelector("#language-select") as HTMLSelectElement;
  if (languageSelect) {
    languageSelect.addEventListener("change", () => {
      const selectedLanguage = languageSelect.value;
      state.selectedLanguage = selectedLanguage as Language;
    });
  }

  let options = document.querySelectorAll(".fill-blank-option-word");
  options.forEach(option => {
    option.addEventListener('click', ()=>{
      // when an option is selected maybe add it to the state object
      // animate between the start and end positions
      // get the text of the clicked on element and replace the placeholder word with that text.
      // Then pass the placeholder element and this element to the FLIP animation function
      
    }) 
  });

}

async function getFillBlankQuestion(language : Language) : Promise<FillBlankQuestion>{
  // get the fill in the blank question for the current language
  return {
    fillBlankQuestionId : 1,
    difficultyScore : 10,
    distractors: ["vertragte", "lelike", "poeste"],
    missingWord: "kak",
    placeholderSentence : "Rudolph is 'n ___ man.",
  }
}

function loadUserLandingPage() {
  // subscribe all event listeners for the landing page
}

function loadInstructorLandingPage() {

}

function loadAdminPage() {

}

function loadTranslationPage() {

}

function loadFillBlankPage() {

}

// API client
//--------------------------------------------------------------------------------------------------------------------------
let token: string | null = null;

function setToken(newToken: string) {
  token = newToken;
}

async function apiFetch(path: string, options: RequestInit = {}) {
  const headers: HeadersInit = {
    ...(options.headers || {}),
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}, Message: ${(await response.json() as { message: string }).message}`);
  }
  return response.json();
}

document.addEventListener("DOMContentLoaded", () => {
  main();
});


// Types
//--------------------------------------------------------------------------------------------------------------------------------
type User = {
  userId: number | null;
  googleId: string;
  email: string;
  name: string;
  roleId: number;
};

type Role = {
  id: number | null;
  role: "USER" | "INSTRUCTOR";
}

type Language = "Afrikaans" | "Spanish" | "Italian" | "German" | "French"

type FillBlankQuestion = {
  fillBlankQuestionId : number;
  placeholderSentence : string;
  missingWord : string;
  distractors : string[];
  difficultyScore : number;
}

interface RouteDefinition {
  content: () => string | undefined;
  loadCallback: () => void;
}

