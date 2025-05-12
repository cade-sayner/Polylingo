// Fill in the blank exercise 
//-------------------------------------------------------------------------------------------------------------------
import { Language } from "../types"
import { FillBlankQuestion } from "../types";
import { navigateTo } from "../navigation";
import { apiFetch } from "../api-client";
import { getSignedInUser, shuffle } from "../utils";

const seaSponge: string = "rgb(215, 255, 184)";
const colorCrab: string = "rgb(255, 120, 120)";

let currentStreak: number = 0;
let currentLanguageSelection: Language = "Afrikaans";
let currentUserId : number | null = null;

const languageOptions = ["Afrikaans", "German", "Italian", "Spanish", "French"];
const imageSrcs = ["springbok-speaker.png", "lion-character.png"];


class fillBlankExerciseState {
    currentQuestion: FillBlankQuestion | undefined;
    placeholderSentenceSectionElement: HTMLSelectElement;
    optionsSectionElement: HTMLSelectElement;
    selectedOption: string | undefined;
    checkButton: HTMLButtonElement;

    constructor() {
        this.placeholderSentenceSectionElement = document.querySelector(".placeholder-sentence") as HTMLSelectElement;
        this.optionsSectionElement = document.querySelector(".question-options") as HTMLSelectElement;
        this.checkButton = document.querySelector("#question-check") as HTMLButtonElement;
    }

    async getQuestion() {
        //choose a character to display
        const character = imageSrcs[Math.floor(Math.random() * imageSrcs.length)];
        console.log(character)
        const characterImage = document.querySelector(".speaker-image") as HTMLImageElement;
        characterImage.src = `/img/${character}`;
        this.currentQuestion = await getFillBlankQuestion(currentLanguageSelection);
        this.placeholderSentenceSectionElement.innerHTML = generateInlineSentence(this.currentQuestion.placeholderSentence);
        this.optionsSectionElement.innerHTML = generateOptions(shuffle([...this.currentQuestion.distractors, this.currentQuestion.word]));
        registerOptions(this);
    }
}

function generateOptions(options: string[]) {
    let s = options.map((word) => `<button class="call-sans question-option-word"> ${word} </button>`).join("");
    return s;
}

function generateInlineSentence(sentence: string) {
    return sentence.split(" ").map((word) => `<span class=${word === "____" ? "placeholder-word" : "sentence-word"}> ${word === "____" ? `<p id="missing-word-placeholder" class="missing-word flip-animate">A Word</p>` : word} </span>`).join("");
}

function setStreak(val: number) {
    currentStreak = val;
    const streakElement = document.querySelector(".streak") as HTMLElement;
    streakElement.innerText = currentStreak.toString();
}

async function audit(fillBlankId: number, correct: boolean) {
    if(!currentUserId){throw new Error("Failed to audit");}
    console.log(fillBlankId);
    await apiFetch("/api/audit/fill-blank", {
        method:"Post",
        body: JSON.stringify({
            userId: currentUserId,
            fillBlankQuestionId: fillBlankId,
            answerCorrect: correct
        })
    })
}

export async function loadFillBlankExercise() {
    let state = new fillBlankExerciseState();
    await state.getQuestion();

    setStreak(0);

    currentUserId = (await getSignedInUser()).userId;
    let languageSelect = document.querySelector("#language-select") as HTMLSelectElement;
    languageSelect.selectedIndex = languageOptions.indexOf(currentLanguageSelection);

    if (languageSelect) {
        languageSelect.addEventListener("change", () => {
            currentLanguageSelection = languageSelect.value as Language;
        });
    }

    const skipButton = document.querySelector("#question-skip") as HTMLButtonElement;
    const fillBlankFooter = document.querySelector(".question-footer") as HTMLElement;
    const resultImage = document.querySelector("#question-result-figure") as HTMLElement;

    state.checkButton.disabled = true;
    state.checkButton?.addEventListener('click', async (e) => {
        if (state.currentQuestion?.completed) {
            state.getQuestion();
            resultImage.innerHTML = "";
            resultImage.style.display = "none";
            state.checkButton.innerText = "Check";
            state.checkButton.disabled = true;
            skipButton.style.visibility = "visible";
            fillBlankFooter.style.backgroundColor = "white";
            return;
        }
        if (state.currentQuestion && !state.currentQuestion?.completed) {
            // they have clicked check answer
            state.currentQuestion.completed = true;
            state.checkButton.innerText = "Next"
            skipButton.style.visibility = "hidden";
            if (state.selectedOption === state.currentQuestion?.word) {
                fillBlankFooter.style.backgroundColor = seaSponge;
                resultImage.innerHTML = "<img class=\"result-image\" src=\"/img/correct.png\"> <div> Well done! </div>";
                resultImage.style.display = "block";
                setStreak(currentStreak + 1);
                await audit(state.currentQuestion.fillBlankQuestionsId, true);
            } else {
                fillBlankFooter.style.backgroundColor = colorCrab;
                resultImage.innerHTML = `<img class="result-image" src="/img/incorrect.png"> <div class="answer-text"> The correct answer was '${state.currentQuestion.word}' </div>`
                resultImage.style.display = "block";
                setStreak(0);
                await audit(state.currentQuestion.fillBlankQuestionsId, true);
            }
            return;
        }
    })

    skipButton?.addEventListener('click', async (e) => {
        await state.getQuestion();
    })
}

function registerOptions(state: fillBlankExerciseState) {
    let options = document.querySelectorAll(".question-option-word");
    options.forEach(option => {
        option.addEventListener('click', (e) => {
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
}

async function getFillBlankQuestion(language: Language): Promise<FillBlankQuestion> {
    // no this needs to go through the api client
    let response = await apiFetch(`/api/fill_blank/user?language=${language}`);
    return response as FillBlankQuestion;
}