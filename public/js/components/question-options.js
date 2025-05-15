import { flipAnimation } from "../utils";
export class QuestionOptions {
    render(options) {
        return options.map((word) => {
            const button = document.createElement('button');
            button.className = 'call-sans question-option-word';
            button.textContent = word;
            return button;
        });
    }
    registerOptions(optionState, animate = true) {
        let options = document.querySelectorAll(".question-option-word");
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                var _a;
                if (!((_a = optionState.currentQuestion) === null || _a === void 0 ? void 0 : _a.completed)) {
                    const selectedOption = e.target;
                    selectedOption.classList.add("selected-option");
                    optionState.selectedOption = selectedOption.innerText;
                    if (optionState.checkButton) {
                        optionState.checkButton.disabled = false;
                    }
                    if (e.target && animate) {
                        flipAnimation(e.target, document.querySelector("#missing-word-placeholder"));
                    }
                    // add the selected class here
                    const clickedButton = e.target;
                    options.forEach(opt => opt.classList.remove("selected-option"));
                    clickedButton.classList.add("selected-option");
                }
            });
        });
    }
}
