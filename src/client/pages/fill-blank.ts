// Fill in the blank exercise 
//-------------------------------------------------------------------------------------------------------------------

class fillBlankExerciseState {
    selectedLanguage: Language;
    currentQuestion: FillBlankQuestion | undefined;
    placeholderSentenceSectionElement: HTMLSelectElement;
    optionsSectionElement: HTMLSelectElement;
    selectedOption: string | undefined;

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

function generateOptions(options: string[]) {
    let s = options.map((word) => `<button class="call-sans fill-blank-option-word"> ${word} </button>`).join("");
    return s;
}

function generateInlineSentence(sentence: string, missingWord: string) {
    return sentence.split(" ").map((word) => `<span class=${word === "___" ? "placeholder-word" : "sentence-word"}> ${word === "___" ? `<p id="missing-word-placeholder" class="missing-word flip-animate">A Word</p>` : word} </span>`).join("");
}

export async function loadFillBlankExercise() {
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
        option.addEventListener('click', (e) => {
            // when an option is selected maybe add it to the state object
            // animate between the start and end positions
            // get the text of the clicked on element and replace the placeholder word with that text.
            // Then pass the placeholder element and this element to the FLIP animation function
            state.selectedOption = (e.target as HTMLElement).innerText
            if (e.target) {
                flipAnimation(e.target as HTMLElement, document.querySelector("#missing-word-placeholder") as HTMLElement)
            }
        })
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
        console.log("Doing the back up pass");
        end.style.transform = `translate(0px, 0px)`;
    }, 100);
    setTimeout(() => {
        end.style.transitionDuration = "0s";
    }, 400);
    // then set the transform back to 0 after 100 ms
}

async function getFillBlankQuestion(language: Language): Promise<FillBlankQuestion> {
    // get the fill in the blank question for the current language
    return {
        fillBlankQuestionId: 1,
        difficultyScore: 10,
        distractors: ["vertragte", "lelike", "poeste"],
        missingWord: "kak",
        placeholderSentence: "Rudolph is 'n ___ man.",
    }
}