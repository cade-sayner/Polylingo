import { flipAnimation } from "../utils";
export class QuestionOptions {
    render(options) {
        let s = options.map((word) => `<button class="call-sans question-option-word"> ${word} </button>`).join("");
        return s;
    }
    registerOptions(optionState) {
        let options = document.querySelectorAll(".question-option-word");
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                var _a;
                if (!((_a = optionState.currentQuestion) === null || _a === void 0 ? void 0 : _a.completed)) {
                    optionState.selectedOption = e.target.innerText;
                    if (optionState.checkButton) {
                        optionState.checkButton.disabled = false;
                    }
                    if (e.target) {
                        flipAnimation(e.target, document.querySelector("#missing-word-placeholder"));
                    }
                }
            });
        });
    }
}
