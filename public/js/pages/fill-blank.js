import { navigateTo } from "../navigation";
const seaSponge = "rgb(215, 255, 184)";
const colorCrab = "rgb(255, 120, 120)";
let currentStreak = 0;
let currentLanguageSelection = "Afrikaans";
const languageOptions = ["Afrikaans", "German", "Italian", "Spanish", "French"];
const imageSrcs = ["springbok-speaker.png", "lion-character.png"];
class fillBlankExerciseState {
    constructor() {
        this.placeholderSentenceSectionElement = document.querySelector(".placeholder-sentence");
        this.optionsSectionElement = document.querySelector(".fill-blank-options");
        this.checkButton = document.querySelector("#fill-blank-check");
    }
    async getQuestion() {
        this.currentQuestion = await getFillBlankQuestion(currentLanguageSelection);
        this.placeholderSentenceSectionElement.innerHTML = generateInlineSentence(this.currentQuestion.placeholderSentence);
        this.optionsSectionElement.innerHTML = generateOptions([...this.currentQuestion.distractors, this.currentQuestion.word]);
    }
}
function generateOptions(options) {
    let s = options.map((word) => `<button class="call-sans fill-blank-option-word"> ${word} </button>`).join("");
    return s;
}
function generateInlineSentence(sentence) {
    return sentence.split(" ").map((word) => `<span class=${word === "____" ? "placeholder-word" : "sentence-word"}> ${word === "____" ? `<p id="missing-word-placeholder" class="missing-word flip-animate">A Word</p>` : word} </span>`).join("");
}
export async function loadFillBlankExercise() {
    let state = new fillBlankExerciseState();
    await state.getQuestion();
    let languageSelect = document.querySelector("#language-select");
    languageSelect.selectedIndex = languageOptions.indexOf(currentLanguageSelection);
    if (languageSelect) {
        languageSelect.addEventListener("change", () => {
            currentLanguageSelection = languageSelect.value;
        });
    }
    //choose a character to display
    const character = imageSrcs[Math.floor(Math.random() * imageSrcs.length)];
    console.log(character);
    const characterImage = document.querySelector(".speaker-image");
    characterImage.src = `/img/${character}`;
    registerOptions(state);
    const checkButton = document.querySelector("#fill-blank-check");
    const skipButton = document.querySelector("#fill-blank-skip");
    const fillBlankFooter = document.querySelector(".fill-blank-footer");
    const resultImage = document.querySelector("#fill-blank-result-figure");
    const streakElement = document.querySelector(".streak");
    streakElement.innerText = currentStreak.toString();
    checkButton.disabled = true;
    checkButton === null || checkButton === void 0 ? void 0 : checkButton.addEventListener('click', (e) => {
        var _a, _b, _c;
        if ((_a = state.currentQuestion) === null || _a === void 0 ? void 0 : _a.completed) {
            // TODO make audit request
            navigateTo("/exercise/fill-blank");
            return;
        }
        if (state.currentQuestion && !((_b = state.currentQuestion) === null || _b === void 0 ? void 0 : _b.completed)) {
            state.currentQuestion.completed = true;
            checkButton.innerText = "Next";
            skipButton.style.visibility = "hidden";
            if (state.selectedOption === ((_c = state.currentQuestion) === null || _c === void 0 ? void 0 : _c.word)) {
                fillBlankFooter.style.backgroundColor = seaSponge;
                resultImage.innerHTML = "<img class=\"result-image\" src=\"/img/correct.png\"> <div> Well done! </div>";
                currentStreak += 1;
            }
            else {
                fillBlankFooter.style.backgroundColor = colorCrab;
                resultImage.innerHTML = `<img class="result-image" src="/img/incorrect.png"> <div> The correct answer was '${state.currentQuestion.word}' </div>`;
                currentStreak = 0;
            }
            return;
        }
    });
    skipButton === null || skipButton === void 0 ? void 0 : skipButton.addEventListener('click', (e) => {
        navigateTo("/exercise/fill-blank");
    });
}
function registerOptions(state) {
    let options = document.querySelectorAll(".fill-blank-option-word");
    options.forEach(option => {
        option.addEventListener('click', (e) => {
            var _a;
            // when an option is selected maybe add it to the state object
            // animate between the start and end positions
            // get the text of the clicked on element and replace the placeholder word with that text.
            // Then pass the placeholder element and this element to the FLIP animation function
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
    // then set the transform back to 0 after 100 ms
}
async function getFillBlankQuestion(language) {
    // no this needs to go through the api client
    let response = await fetch(`/api/fill_blank/user?language=${language}`);
    if (!response.ok) {
        throw new Error("Fetching question failed");
    }
    return await response.json();
}
