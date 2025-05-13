import { apiFetch } from "../api-client";
import { getSignedInUser } from "../utils";
const seaSponge = "rgb(215, 255, 184)";
const colorCrab = "rgb(255, 120, 120)";
let currentStreak = 0;
let currentLanguageSelection = "Afrikaans";
let currentUserId = null;
const languageOptions = ["Afrikaans", "German", "Italian", "Spanish", "French"];
const imageSrcs = ["springbok-speaker.png", "lion-character.png"];
class translationExerciseState {
    constructor() {
        this.promptWordElement = document.querySelector(".placeholder-sentence");
        this.optionsSectionElement = document.querySelector(".fill-blank-options");
        this.checkButton = document.querySelector("#fill-blank-check");
    }
    async getQuestion() {
        const character = imageSrcs[Math.floor(Math.random() * imageSrcs.length)];
        const characterImage = document.querySelector(".speaker-image");
        characterImage.src = `/img/${character}`;
        this.currentQuestion = await getTranslationQuestion(currentLanguageSelection);
        this.promptWordElement.innerHTML = this.currentQuestion.promptWord;
        this.optionsSectionElement.innerHTML = generateOptions([...this.currentQuestion.distractors, this.currentQuestion.answerWord]);
        registerOptions(this);
    }
}
function generateOptions(options) {
    let s = options.map((word) => `<button class="call-sans fill-blank-option-word"> ${word} </button>`).join("");
    return s;
}
function setStreak(val) {
    currentStreak = val;
    const streakElement = document.querySelector(".streak");
    streakElement.innerText = currentStreak.toString();
}
async function audit(translationQuestionId, correct) {
    if (!currentUserId) {
        throw new Error("Failed to audit");
    }
    console.log(translationQuestionId);
    await apiFetch("/api/audit/translation", {
        method: "Post",
        body: JSON.stringify({
            userId: currentUserId,
            translationQuestionId: translationQuestionId,
            answerCorrect: correct
        })
    });
}
export async function loadTranslationExercise() {
    let state = new translationExerciseState();
    await state.getQuestion();
    currentUserId = (await getSignedInUser()).userId;
    let languageSelect = document.querySelector("#language-select");
    languageSelect.selectedIndex = languageOptions.indexOf(currentLanguageSelection);
    if (languageSelect) {
        languageSelect.addEventListener("change", () => {
            currentLanguageSelection = languageSelect.value;
        });
    }
    const checkButton = document.querySelector("#fill-blank-check");
    const skipButton = document.querySelector("#fill-blank-skip");
    const fillBlankFooter = document.querySelector(".fill-blank-footer");
    const resultImage = document.querySelector("#fill-blank-result-figure");
    checkButton.disabled = true;
    checkButton === null || checkButton === void 0 ? void 0 : checkButton.addEventListener('click', async (e) => {
        var _a, _b, _c, _d, _e;
        if ((_a = state.currentQuestion) === null || _a === void 0 ? void 0 : _a.completed) {
            // TODO make audit request
            state.getQuestion();
            resultImage.innerHTML = "";
            checkButton.innerText = "Check";
            skipButton.style.visibility = "visible";
            fillBlankFooter.style.backgroundColor = "white";
            return;
        }
        if (state.currentQuestion && !((_b = state.currentQuestion) === null || _b === void 0 ? void 0 : _b.completed)) {
            // they have clicked check answer
            state.currentQuestion.completed = true;
            checkButton.innerText = "Next";
            skipButton.style.visibility = "hidden";
            if (state.selectedOption === ((_c = state.currentQuestion) === null || _c === void 0 ? void 0 : _c.answerWord)) {
                fillBlankFooter.style.backgroundColor = seaSponge;
                (_d = document.querySelector(".selected-option")) === null || _d === void 0 ? void 0 : _d.classList.add("correct-option");
                resultImage.innerHTML = "<img class=\"result-image\" src=\"/img/correct.png\"> <div> Well done! </div>";
                setStreak(currentStreak + 1);
                console.log(state.currentQuestion);
                await audit(state.currentQuestion.translationQuestionId, true);
            }
            else {
                fillBlankFooter.style.backgroundColor = colorCrab;
                (_e = document.querySelector(".selected-option")) === null || _e === void 0 ? void 0 : _e.classList.add("wrong-option");
                resultImage.innerHTML = `<img class="result-image" src="/img/incorrect.png"> <div> The correct answer was '${state.currentQuestion.answerWord}' </div>`;
                setStreak(0);
                await audit(state.currentQuestion.translationQuestionId, true);
            }
            return;
        }
    });
    skipButton === null || skipButton === void 0 ? void 0 : skipButton.addEventListener('click', async (e) => {
        await state.getQuestion();
    });
}
function registerOptions(state) {
    let options = document.querySelectorAll(".fill-blank-option-word");
    options.forEach(option => {
        option.addEventListener('click', (e) => {
            var _a;
            if (!((_a = state.currentQuestion) === null || _a === void 0 ? void 0 : _a.completed)) {
                const clickedButton = e.target;
                state.selectedOption = clickedButton.innerText.trim();
                state.checkButton.disabled = false;
                options.forEach(opt => opt.classList.remove("selected-option"));
                clickedButton.classList.add("selected-option");
            }
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
        end.style.transform = `translate(0px, 0px)`;
    }, 100);
    setTimeout(() => {
        end.style.transitionDuration = "0s";
    }, 400);
    // then set the transform back to 0 after 100 ms
}
async function getTranslationQuestion(language) {
    let response = await apiFetch(`/api/translationquestions/user?prompt_language=Afrikaans&answer_language=English`);
    return await response;
}
