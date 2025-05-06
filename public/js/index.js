"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const routes = {
    '/login': { content: () => { var _a; return (_a = document.querySelector(".login-screen-template")) === null || _a === void 0 ? void 0 : _a.innerHTML; }, loadCallback: loadLoginPage },
    '/landing/user': { content: () => { var _a; return (_a = document.querySelector(".landing-page-template")) === null || _a === void 0 ? void 0 : _a.innerHTML; }, loadCallback: loadUserLandingPage },
    '/landing/instructor': { content: () => { var _a; return (_a = document.querySelector(".instructor-landing-page-template")) === null || _a === void 0 ? void 0 : _a.innerHTML; }, loadCallback: loadInstructorLandingPage },
    '/': { content: () => { var _a; return (_a = document.querySelector(".loadingLandingPageTemplate")) === null || _a === void 0 ? void 0 : _a.innerHTML; }, loadCallback: loadLandingPage },
    '/exercise/fill-blank': { content: () => { var _a; return (_a = document.querySelector(".fill-blank-template")) === null || _a === void 0 ? void 0 : _a.innerHTML; }, loadCallback: loadFillBlankExercise }
};
const googleAuthURI = "https://accounts.google.com/o/oauth2/auth?client_id=988182050054-vlcub1cr22892gc1e4uesj5d6sa3ji1v.apps.googleusercontent.com&redirect_uri=http://localhost:3000/login.html&response_type=code&scope=openid%20phone%20email%20profile";
const API_BASE_URL = "http://localhost:3000";
const applicationUri = "http://localhost:3000";
function render(path) {
    var _a, _b;
    const pageContent = (_b = (_a = routes[path]) === null || _a === void 0 ? void 0 : _a.content()) !== null && _b !== void 0 ? _b : "<section> 404 not found </section>";
    let pageContainer = document.querySelector(".page-container");
    if (pageContainer) {
        pageContainer.innerHTML = pageContent;
    }
    routes[path].loadCallback();
}
function navigateTo(path) {
    history.pushState({}, '', `${applicationUri}${path}`);
    render(path);
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
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
    });
}
function loadLoginPage() {
    const loginButton = document.querySelector(".login-button");
    loginButton === null || loginButton === void 0 ? void 0 : loginButton.addEventListener('click', () => {
        window.location.href = googleAuthURI;
    });
}
function loadLandingPage() {
    return __awaiter(this, void 0, void 0, function* () {
        let role = yield apiFetch("/api/users/role");
        if (role.role == "USER") {
            navigateTo("/landing/user");
            return;
        }
        if (role.role == "INSTRUCTOR") {
            navigateTo("/landing/instructor");
        }
    });
}
// Fill in the blank exercise 
//-------------------------------------------------------------------------------------------------------------------
class fillBlankExerciseState {
    constructor() {
        this.selectedLanguage = "Afrikaans";
        this.placeholderSentenceSectionElement = document.querySelector(".placeholder-sentence");
        this.optionsSectionElement = document.querySelector(".fill-blank-options");
    }
    getQuestion() {
        return __awaiter(this, void 0, void 0, function* () {
            this.currentQuestion = yield getFillBlankQuestion(this.selectedLanguage);
            this.placeholderSentenceSectionElement.innerHTML = generateInlineSentence(this.currentQuestion.placeholderSentence, this.currentQuestion.missingWord);
            this.optionsSectionElement.innerHTML = generateOptions([...this.currentQuestion.distractors, this.currentQuestion.missingWord]);
        });
    }
}
function generateOptions(options) {
    let s = options.map((word) => `<button class="fill-blank-option-word"> ${word} </button>`).join("");
    return s;
}
function generateInlineSentence(sentence, missingWord) {
    return sentence.split(" ").map((word) => `<span class=${word === "___" ? "placeholder-word" : "sentence-word"}> ${word === "___" ? `<p id="missing-word-placeholder" class="missing-word flip-animate">A Word</p>` : word} </span>`).join("");
}
function loadFillBlankExercise() {
    return __awaiter(this, void 0, void 0, function* () {
        // check that you have the user role?
        // add event listeners
        let state = new fillBlankExerciseState();
        yield state.getQuestion();
        let languageSelect = document.querySelector("#language-select");
        if (languageSelect) {
            languageSelect.addEventListener("change", () => {
                const selectedLanguage = languageSelect.value;
                state.selectedLanguage = selectedLanguage;
            });
        }
        let options = document.querySelectorAll(".fill-blank-option-word");
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                // when an option is selected maybe add it to the state object
                // animate between the start and end positions
                // get the text of the clicked on element and replace the placeholder word with that text.
                // Then pass the placeholder element and this element to the FLIP animation function
                if (e.target) {
                    flipAnimation(e.target, document.querySelector("#missing-word-placeholder"));
                }
            });
        });
    });
}
function flipAnimation(start, end) {
    // set the transform of end element to be that of the start element
    end.innerHTML = start.innerHTML;
    const { left: endCoordX, top: endCoordY } = end.getBoundingClientRect();
    const { left: startCoordX, top: startCoordY } = start.getBoundingClientRect();
    const deltaX = startCoordX - endCoordX;
    const deltaY = startCoordY - endCoordY;
    end.style.transform = `translate(${deltaX}px,${deltaY}px)`;
    end.style.visibility = "visible";
    setTimeout(() => {
        end.style.transitionDuration = "0.3s";
        console.log("Doing the back up pass");
        end.style.transform = `translate(0px, 0px)`;
    }, 100);
    setTimeout(() => {
        end.style.transitionDuration = "0s";
    }, 400);
    // then set the transform back to 0 after 100 ms
}
function getFillBlankQuestion(language) {
    return __awaiter(this, void 0, void 0, function* () {
        // get the fill in the blank question for the current language
        return {
            fillBlankQuestionId: 1,
            difficultyScore: 10,
            distractors: ["vertragte", "lelike", "poeste"],
            missingWord: "kak",
            placeholderSentence: "Rudolph is 'n ___ man.",
        };
    });
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
let token = null;
function setToken(newToken) {
    token = newToken;
}
function apiFetch(path_1) {
    return __awaiter(this, arguments, void 0, function* (path, options = {}) {
        const headers = Object.assign(Object.assign({}, (options.headers || {})), { Authorization: token ? `Bearer ${token}` : "", "Content-Type": "application/json" });
        const response = yield fetch(`${API_BASE_URL}${path}`, Object.assign(Object.assign({}, options), { headers }));
        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}, Message: ${(yield response.json()).message}`);
        }
        return response.json();
    });
}
document.addEventListener("DOMContentLoaded", () => {
    main();
});
