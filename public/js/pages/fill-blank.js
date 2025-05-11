import { apiFetch } from "../api-client";
import { getSignedInUser } from "../utils";
const seaSponge = "rgb(215, 255, 184)";
const colorCrab = "rgb(255, 120, 120)";
let currentStreak = 0;
let currentLanguageSelection = "Afrikaans";
let currentUserId = null;
const languageOptions = ["Afrikaans", "German", "Italian", "Spanish", "French"];
const imageSrcs = ["springbok-speaker.png", "lion-character.png"];
class fillBlankExerciseState {
    constructor() {
        this.placeholderSentenceSectionElement = document.querySelector(".placeholder-sentence");
        this.optionsSectionElement = document.querySelector(".fill-blank-options");
        this.checkButton = document.querySelector("#fill-blank-check");
    }
    async getQuestion() {
        //choose a character to display
        const character = imageSrcs[Math.floor(Math.random() * imageSrcs.length)];
        console.log(character);
        const characterImage = document.querySelector(".speaker-image");
        characterImage.src = `/img/${character}`;
        this.currentQuestion = await getFillBlankQuestion(currentLanguageSelection);
        this.placeholderSentenceSectionElement.innerHTML = generateInlineSentence(this.currentQuestion.placeholderSentence);
        this.optionsSectionElement.innerHTML = generateOptions([...this.currentQuestion.distractors, this.currentQuestion.word]);
        registerOptions(this);
    }
}
function generateOptions(options) {
    let s = options.map((word) => `<button class="call-sans fill-blank-option-word"> ${word} </button>`).join("");
    return s;
}
function generateInlineSentence(sentence) {
    return sentence.split(" ").map((word) => `<span class=${word === "____" ? "placeholder-word" : "sentence-word"}> ${word === "____" ? `<p id="missing-word-placeholder" class="missing-word flip-animate">A Word</p>` : word} </span>`).join("");
}
function setStreak(val) {
    currentStreak = val;
    const streakElement = document.querySelector(".streak");
    streakElement.innerText = currentStreak.toString();
}
async function audit(fillBlankId, correct) {
    if (!currentUserId) {
        throw new Error("Failed to audit");
    }
    console.log(fillBlankId);
    await apiFetch("/api/audit/fill-blank", {
        method: "Post",
        body: JSON.stringify({
            userId: currentUserId,
            fillBlankQuestionId: fillBlankId,
            answerCorrect: correct
        })
    });
}
export async function loadFillBlankExercise() {
    var _a;
    let state = new fillBlankExerciseState();
    await state.getQuestion();
    currentUserId = (await getSignedInUser()).userId;
    let languageSelect = document.querySelector("#language-select");
    languageSelect.selectedIndex = languageOptions.indexOf(currentLanguageSelection);
    if (languageSelect) {
        languageSelect.addEventListener("change", () => {
            currentLanguageSelection = languageSelect.value;
        });
    }
    const skipButton = document.querySelector("#fill-blank-skip");
    const fillBlankFooter = document.querySelector(".fill-blank-footer");
    const resultImage = document.querySelector("#fill-blank-result-figure");
    state.checkButton.disabled = true;
    (_a = state.checkButton) === null || _a === void 0 ? void 0 : _a.addEventListener('click', async (e) => {
        var _a, _b, _c;
        if ((_a = state.currentQuestion) === null || _a === void 0 ? void 0 : _a.completed) {
            state.getQuestion();
            resultImage.innerHTML = "";
            resultImage.style.display = "none";
            state.checkButton.innerText = "Check";
            state.checkButton.disabled = true;
            skipButton.style.visibility = "visible";
            fillBlankFooter.style.backgroundColor = "white";
            return;
        }
        if (state.currentQuestion && !((_b = state.currentQuestion) === null || _b === void 0 ? void 0 : _b.completed)) {
            // they have clicked check answer
            state.currentQuestion.completed = true;
            state.checkButton.innerText = "Next";
            skipButton.style.visibility = "hidden";
            if (state.selectedOption === ((_c = state.currentQuestion) === null || _c === void 0 ? void 0 : _c.word)) {
                fillBlankFooter.style.backgroundColor = seaSponge;
                resultImage.innerHTML = "<img class=\"result-image\" src=\"/img/correct.png\"> <div> Well done! </div>";
                resultImage.style.display = "block";
                setStreak(currentStreak + 1);
                await audit(state.currentQuestion.fillBlankQuestionsId, true);
            }
            else {
                fillBlankFooter.style.backgroundColor = colorCrab;
                resultImage.innerHTML = `<img class="result-image" src="/img/incorrect.png"> <div> The correct answer was '${state.currentQuestion.word}' </div>`;
                resultImage.style.display = "block";
                setStreak(0);
                await audit(state.currentQuestion.fillBlankQuestionsId, true);
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
                state.selectedOption = e.target.innerText;
                state.checkButton.disabled = false;
                if (e.target) {
                    flipAnimation(e.target, document.querySelector("#missing-word-placeholder"));
                }
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
}
async function getFillBlankQuestion(language) {
    // no this needs to go through the api client
    let response = await apiFetch(`/api/fill_blank/user?language=${language}`);
    return response;
}
