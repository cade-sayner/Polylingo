// Fill in the blank exercise 
//-------------------------------------------------------------------------------------------------------------------
import { Language } from "../types"
import { FillBlankQuestion } from "../types";
import { navigateTo } from "../navigation";

const seaSponge: string = "rgb(215, 255, 184)";
const colorCrab: string = "rgb(255, 120, 120)";

let currentStreak : number = 0;
let currentLanguageSelection : Language = "Afrikaans";
const languageOptions = ["Afrikaans", "German", "Italian", "Spanish", "French"];

class fillBlankExerciseState {
    currentQuestion: FillBlankQuestion | undefined;
    placeholderSentenceSectionElement: HTMLSelectElement;
    optionsSectionElement: HTMLSelectElement;
    selectedOption: string | undefined;
    checkButton: HTMLButtonElement;

    constructor() {
        this.placeholderSentenceSectionElement = document.querySelector(".placeholder-sentence") as HTMLSelectElement;
        this.optionsSectionElement = document.querySelector(".fill-blank-options") as HTMLSelectElement;
        this.checkButton = document.querySelector("#fill-blank-check") as HTMLButtonElement;
    }

    async getQuestion() {
        this.currentQuestion = await getFillBlankQuestion(currentLanguageSelection);
        this.placeholderSentenceSectionElement.innerHTML = generateInlineSentence(this.currentQuestion.placeholderSentence, this.currentQuestion.word);
        this.optionsSectionElement.innerHTML = generateOptions([...this.currentQuestion.distractors, this.currentQuestion.word]);
    }
}

function generateOptions(options: string[]) {
    let s = options.map((word) => `<button class="call-sans fill-blank-option-word"> ${word} </button>`).join("");
    return s;
}

function generateInlineSentence(sentence: string, missingWord: string) {
    return sentence.split(" ").map((word) => `<span class=${word === "____" ? "placeholder-word" : "sentence-word"}> ${word === "____" ? `<p id="missing-word-placeholder" class="missing-word flip-animate">A Word</p>` : word} </span>`).join("");
}

export async function loadFillBlankExercise() {
    let state = new fillBlankExerciseState();
    await state.getQuestion();

    let languageSelect = document.querySelector("#language-select") as HTMLSelectElement;
    languageSelect.selectedIndex = languageOptions.indexOf(currentLanguageSelection);

    if (languageSelect) {
        languageSelect.addEventListener("change", () => {
            currentLanguageSelection = languageSelect.value as Language;
        });
    }

    registerOptions(state);

    const checkButton = document.querySelector("#fill-blank-check") as HTMLButtonElement;
    const skipButton = document.querySelector("#fill-blank-skip") as HTMLButtonElement;
    const fillBlankFooter = document.querySelector(".fill-blank-footer") as HTMLElement;
    const resultImage = document.querySelector("#fill-blank-result-figure") as HTMLElement;
    const streakElement = document.querySelector(".streak") as HTMLElement;

    streakElement.innerText = currentStreak.toString();
    checkButton.disabled = true;
    checkButton?.addEventListener('click', (e) => {
        if (state.currentQuestion?.completed) {
            // TODO make audit request
            navigateTo("/exercise/fill-blank");
            return;
        }
        if (state.currentQuestion && !state.currentQuestion?.completed) {
            state.currentQuestion.completed = true;
            checkButton.innerText = "Next"
            skipButton.style.visibility = "hidden";
            if (state.selectedOption === state.currentQuestion?.word) {
                fillBlankFooter.style.backgroundColor = seaSponge;
                resultImage.innerHTML = "<img class=\"result-image\" src=\"/img/correct.png\"> <div> Well done! </div>";
                currentStreak += 1;
            } else {
                fillBlankFooter.style.backgroundColor = colorCrab;
                resultImage.innerHTML = `<img class="result-image" src="/img/incorrect.png"> <div> The correct answer was '${state.currentQuestion.word}' </div>`
                currentStreak = 0;
            }
            return;
        }
    })

    skipButton?.addEventListener('click', (e) => {
        navigateTo("/exercise/fill-blank");
    })
}

function registerOptions(state: fillBlankExerciseState) {
    let options = document.querySelectorAll(".fill-blank-option-word");
    options.forEach(option => {
        option.addEventListener('click', (e) => {
            // when an option is selected maybe add it to the state object
            // animate between the start and end positions
            // get the text of the clicked on element and replace the placeholder word with that text.
            // Then pass the placeholder element and this element to the FLIP animation function
            if (!state.currentQuestion?.completed) {
                state.selectedOption = (e.target as HTMLElement).innerText
                state.checkButton.disabled = false;
                if (e.target) {
                    flipAnimation(e.target as HTMLElement, document.querySelector("#missing-word-placeholder") as HTMLElement)
                }
            }
        })
    })
}


function flipAnimation(start: HTMLElement, end: HTMLElement) {
    // set the transform of end element to be that of the start element
    end.innerHTML = start.innerHTML;
    const { left: endCoordX, top: endCoordY } = end.getBoundingClientRect();
    const { left: startCoordX, top: startCoordY } = start.getBoundingClientRect();
    const deltaX = startCoordX - endCoordX;
    const deltaY = startCoordY - endCoordY;

    end.style.transform = `translate(${deltaX}px,${deltaY}px)`;
    end.style.visibility = "visible"
    setTimeout(() => {
        end.style.transitionDuration = "0.3s";
        end.style.transform = `translate(0px, 0px)`;
    }, 100);
    setTimeout(() => {
        end.style.transitionDuration = "0s";
    }, 400);
    // then set the transform back to 0 after 100 ms
}

async function getFillBlankQuestion(language: Language): Promise<FillBlankQuestion> {
    let response = await fetch(`/api/fill_blank?language=${language}`);
    if (!response.ok) {
        throw new Error("Fetching question failed");
    }
    return await response.json() as FillBlankQuestion;
}