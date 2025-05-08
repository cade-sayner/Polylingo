// Fill in the blank exercise 
//-------------------------------------------------------------------------------------------------------------------
import { skip } from "node:test";
import {Language} from "../types"
import { TranslationQuestion } from "../types";
import { navigateTo } from "../navigation";

const seaSponge : string = "rgb(215, 255, 184)";
const colorCrab : string = "rgb(255, 120, 120)";

class translationExerciseState {
    selectedLanguage: Language;
    currentQuestion: TranslationQuestion | undefined;
    promptWordElement: HTMLSelectElement;
    optionsSectionElement: HTMLSelectElement;
    selectedOption: string | undefined;

    constructor() {
        this.selectedLanguage = "Afrikaans";
        this.promptWordElement = document.querySelector(".placeholder-sentence") as HTMLSelectElement;
        this.optionsSectionElement = document.querySelector(".fill-blank-options") as HTMLSelectElement;
    }

    async getQuestion() {
        this.currentQuestion = await getTranslationQuestion(this.selectedLanguage);
        this.promptWordElement.innerHTML = this.currentQuestion.promptWord;
        this.optionsSectionElement.innerHTML = generateOptions([...this.currentQuestion.distractors, this.currentQuestion.answerWord]);
    }
}

function generateOptions(options: string[]) {
    let s = options.map((word) => `<button class="call-sans fill-blank-option-word"> ${word} </button>`).join("");
    return s;
}

// function generateInlineSentence(sentence: string, missingWord: string) {
//     return sentence.split(" ").map((word) => `<span class=${word === "____" ? "placeholder-word" : "sentence-word"}> ${word === "____" ? `<p id="missing-word-placeholder" class="missing-word flip-animate">A Word</p>` : word} </span>`).join("");
// }

export async function loadTranslationExercise() {
    let state = new translationExerciseState();
    await state.getQuestion();

    let languageSelect = document.querySelector("#language-select") as HTMLSelectElement;
    if (languageSelect) {
        languageSelect.addEventListener("change", () => {
            const selectedLanguage = languageSelect.value;
            state.selectedLanguage = selectedLanguage as Language;
        });
    }

    registerOptions(state);

    let checkButton = document.querySelector("#fill-blank-check") as HTMLButtonElement;
    let skipButton = document.querySelector("#fill-blank-skip") as HTMLButtonElement;
    let fillBlankFooter = document.querySelector(".fill-blank-footer") as HTMLElement;

    checkButton?.addEventListener('click', (e) => {
        if(state.currentQuestion?.completed){
            // TODO make audit request
            navigateTo("/exercise/translation");
        }
        skipButton.style.visibility = "hidden";
        checkButton.innerText = "Next";
        if(state.currentQuestion){
            state.currentQuestion.completed = true;
        }
        console.log(state.selectedOption);
        console.log(state.currentQuestion?.answerWord);
        if(state.selectedOption === state.currentQuestion?.answerWord){
            fillBlankFooter.style.backgroundColor = seaSponge;
        }else{
            fillBlankFooter.style.backgroundColor = colorCrab;
        }
    })

    skipButton?.addEventListener('click', (e)=>{
        navigateTo("/exercise/fill-blank");
    })
}

function registerOptions(state: translationExerciseState) {
    let options = document.querySelectorAll(".fill-blank-option-word");
    options.forEach(option => {
        option.addEventListener('click', (e) => {
            if (!state.currentQuestion?.completed) {
                const selectedText = (e.target as HTMLElement).innerText.trim();
                state.selectedOption = selectedText;

                options.forEach(btn => btn.classList.remove("selected-option"));
                (e.target as HTMLElement).classList.add("selected-option");
            }
        });
    });
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

async function getTranslationQuestion(language: Language): Promise<TranslationQuestion> {
    let response = await fetch(`/api/translation?language=${language}`);
    if(!response.ok){
        throw new Error("Fetching question failed");
    }
    else{
        console.log(response)
    }
    return await response.json() as TranslationQuestion;
}