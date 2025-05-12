import { BaseComponent } from "../types";
import { flipAnimation } from "../utils";

export class QuestionOptions implements BaseComponent {
    render(options: string[]) {
        let s = options.map((word) => `<button class="call-sans question-option-word"> ${word} </button>`).join("");
        return s;
    }
    registerOptions(optionState: { currentQuestion: { completed: any; } | undefined; selectedOption: string | undefined; checkButton: { disabled: boolean; } | undefined; }) {
        let options = document.querySelectorAll(".question-option-word");
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                if (!optionState.currentQuestion?.completed) {
                    optionState.selectedOption = (e.target as HTMLElement).innerText;
                    if (optionState.checkButton) {
                        optionState.checkButton.disabled = false;
                    }
                    if (e.target) {
                        flipAnimation(e.target as HTMLElement, document.querySelector("#missing-word-placeholder") as HTMLElement)
                    }
                }
            })
        })
    }

}

