import { BaseComponent } from "../types";
import { flipAnimation } from "../utils";

export class QuestionOptions implements BaseComponent {
    render(options: string[]) {
        return options.map((word) => {
            const button = document.createElement('button');
            button.className = 'call-sans question-option-word';
            button.textContent = word;
            return button;
        });

    }
    registerOptions(optionState: { currentQuestion: { completed: any; } | undefined; selectedOption: string | undefined; checkButton: { disabled: boolean; } | undefined; }, animate: boolean = true) {
        let options = document.querySelectorAll(".question-option-word");
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                if (!optionState.currentQuestion?.completed) {
                    const selectedOption = (e.target as HTMLElement)
                    selectedOption.classList.add("selected-option");
                    optionState.selectedOption = selectedOption.innerText;
                    if (optionState.checkButton) {
                        optionState.checkButton.disabled = false;
                    }
                    if (e.target && animate) {
                        flipAnimation(e.target as HTMLElement, document.querySelector("#missing-word-placeholder") as HTMLElement)
                    }

                    // add the selected class here
                    const clickedButton = e.target as HTMLElement;
                    options.forEach(opt => opt.classList.remove("selected-option"));
                    clickedButton.classList.add("selected-option");
                }
            })
        })
    }
}

