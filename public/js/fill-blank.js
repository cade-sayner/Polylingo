// Fill in the blank exercise 
//-------------------------------------------------------------------------------------------------------------------
class fillBlankExerciseState {
    constructor() {
        this.selectedLanguage = "Afrikaans";
        this.placeholderSentenceSectionElement = document.querySelector(".placeholder-sentence");
        this.optionsSectionElement = document.querySelector(".fill-blank-options");
    }
    async getQuestion() {
        this.currentQuestion = await getFillBlankQuestion(this.selectedLanguage);
        this.placeholderSentenceSectionElement.innerHTML = generateInlineSentence(this.currentQuestion.placeholderSentence, this.currentQuestion.missingWord);
        this.optionsSectionElement.innerHTML = generateOptions([...this.currentQuestion.distractors, this.currentQuestion.missingWord]);
    }
}
function generateOptions(options) {
    let s = options.map((word) => `<button class="call-sans fill-blank-option-word"> ${word} </button>`).join("");
    return s;
}
function generateInlineSentence(sentence, missingWord) {
    return sentence.split(" ").map((word) => `<span class=${word === "___" ? "placeholder-word" : "sentence-word"}> ${word === "___" ? `<p id="missing-word-placeholder" class="missing-word flip-animate">A Word</p>` : word} </span>`).join("");
}
export async function loadFillBlankExercise() {
    let state = new fillBlankExerciseState();
    await state.getQuestion();
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
            state.selectedOption = e.target.innerText;
            if (e.target) {
                flipAnimation(e.target, document.querySelector("#missing-word-placeholder"));
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
        console.log("Doing the back up pass");
        end.style.transform = `translate(0px, 0px)`;
    }, 100);
    setTimeout(() => {
        end.style.transitionDuration = "0s";
    }, 400);
    // then set the transform back to 0 after 100 ms
}
async function getFillBlankQuestion(language) {
    // get the fill in the blank question for the current language
    return {
        fillBlankQuestionId: 1,
        difficultyScore: 10,
        distractors: ["vertragte", "lelike", "poeste"],
        missingWord: "kak",
        placeholderSentence: "Rudolph is 'n ___ man.",
    };
}
