// Translation exercise 
//-------------------------------------------------------------------------------------------------------------------
import {Language} from "../types"
import { TranslationQuestion } from "../types";
import { apiFetch } from "../api-client";
import { getSignedInUser } from "../utils";


const seaSponge: string = "rgb(215, 255, 184)";
const colorCrab: string = "rgb(255, 120, 120)";

let currentStreak: number = 0;
let currentLanguageSelection: Language = "Afrikaans";
let currentUserId : number | null = null;

const languageOptions = ["Afrikaans", "German", "Italian", "Spanish", "French"];
const imageSrcs = ["springbok-speaker.png", "lion-character.png"];

class translationExerciseState {
    currentQuestion: TranslationQuestion | undefined;
    promptWordElement: HTMLSelectElement;
    optionsSectionElement: HTMLSelectElement;
    selectedOption: string | undefined;
    checkButton: HTMLButtonElement;

    constructor() {
        this.promptWordElement = document.querySelector(".placeholder-sentence") as HTMLSelectElement;
        this.optionsSectionElement = document.querySelector(".fill-blank-options") as HTMLSelectElement;
        this.checkButton = document.querySelector("#fill-blank-check") as HTMLButtonElement;
    }

    async getQuestion() {

        const character = imageSrcs[Math.floor(Math.random() * imageSrcs.length)];
        const characterImage = document.querySelector(".speaker-image") as HTMLImageElement;
        characterImage.src = `/img/${character}`;
        this.currentQuestion = await getTranslationQuestion(currentLanguageSelection);
        this.promptWordElement.innerHTML = this.currentQuestion.promptWord;
        this.optionsSectionElement.innerHTML = generateOptions([...this.currentQuestion.distractors, this.currentQuestion.answerWord]);
        registerOptions(this);
    }
}

function generateOptions(options: string[]) {
    let s = options.map((word) => `<button class="call-sans fill-blank-option-word"> ${word} </button>`).join("");
    return s;
}

function setStreak(val: number) {
    currentStreak = val;
    const streakElement = document.querySelector(".streak") as HTMLElement;
    streakElement.innerText = currentStreak.toString();
}

async function audit(translationQuestionId: number, correct: boolean) {
    if(!currentUserId){throw new Error("Failed to audit");}
    console.log(translationQuestionId);
    await apiFetch("/api/audit/translation", {
        method:"Post",
        body: JSON.stringify({
            userId: currentUserId,
            translationQuestionId: translationQuestionId,
            answerCorrect: correct
        })
    })
}


export async function loadTranslationExercise() {
    let state = new translationExerciseState();
    await state.getQuestion();
    currentUserId = (await getSignedInUser()).userId;
    let languageSelect = document.querySelector("#language-select") as HTMLSelectElement;
    languageSelect.selectedIndex = languageOptions.indexOf(currentLanguageSelection);
    
    if (languageSelect) {
        languageSelect.addEventListener("change", () => {
            currentLanguageSelection = languageSelect.value as Language;
        });
    }

    const checkButton = document.querySelector("#fill-blank-check") as HTMLButtonElement;
    const skipButton = document.querySelector("#fill-blank-skip") as HTMLButtonElement;
    const fillBlankFooter = document.querySelector(".fill-blank-footer") as HTMLElement;
    const resultImage = document.querySelector("#fill-blank-result-figure") as HTMLElement;


    checkButton.disabled = true;
    checkButton?.addEventListener('click', async (e) => {
        if (state.currentQuestion?.completed) {
            // TODO make audit request
            state.getQuestion();
            resultImage.innerHTML = "";
            checkButton.innerText = "Check";
            skipButton.style.visibility = "visible";
            fillBlankFooter.style.backgroundColor = "white";
            return;
        }
        if (state.currentQuestion && !state.currentQuestion?.completed) {
            // they have clicked check answer
            state.currentQuestion.completed = true;
            checkButton.innerText = "Next"
            skipButton.style.visibility = "hidden";
            if (state.selectedOption === state.currentQuestion?.answerWord) {
                fillBlankFooter.style.backgroundColor = seaSponge;
                document.querySelector(".selected-option")?.classList.add("correct-option");
                resultImage.innerHTML = "<img class=\"result-image\" src=\"/img/correct.png\"> <div> Well done! </div>";
                setStreak(currentStreak + 1);
                console.log(state.currentQuestion)
                await audit(state.currentQuestion.translationQuestionId, true);
            } else {
                fillBlankFooter.style.backgroundColor = colorCrab;
                document.querySelector(".selected-option")?.classList.add("wrong-option");
                resultImage.innerHTML = `<img class="result-image" src="/img/incorrect.png"> <div> The correct answer was '${state.currentQuestion.answerWord}' </div>`
                setStreak(0);
                await audit(state.currentQuestion.translationQuestionId, true);
            }
            return;
        }
    })

    skipButton?.addEventListener('click', async (e) => {
        await state.getQuestion();
    })
}

function registerOptions(state: translationExerciseState) {
    let options = document.querySelectorAll(".fill-blank-option-word");
    options.forEach(option => {
        option.addEventListener('click', (e) => {
            if (!state.currentQuestion?.completed) {
                const clickedButton = e.target as HTMLElement;
                state.selectedOption = clickedButton.innerText.trim();
                state.checkButton.disabled = false;
                options.forEach(opt => opt.classList.remove("selected-option"));
                clickedButton.classList.add("selected-option");
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

async function getTranslationQuestion(language: Language): Promise<TranslationQuestion> {
    let response = await apiFetch(`/api/translationquestions/user?prompt_language=Afrikaans&answer_language=English`);
    return await response as TranslationQuestion;
}