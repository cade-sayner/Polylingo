import { apiFetch } from "../api-client";
import { BaseComponent } from "../types";
import { setupDistractorInput, AutocompleteService } from "../utils";

export class TranslationComponent implements BaseComponent {
  render() {
    return document.querySelector("#translate-component")?.innerHTML ?? "";
  }

  mount() {
    const promptSelect = document.getElementById("promptLanguage") as HTMLSelectElement;
    const answerSelect = document.getElementById("answerLanguage") as HTMLSelectElement;
    setupDistractorInput()
    if (!promptSelect || !answerSelect) return;

    const originalAnswerOptions = Array.from(answerSelect.options);

    promptSelect.addEventListener("change", () => {
      const selectedPrompt = promptSelect.value;

      answerSelect.innerHTML = "";

      originalAnswerOptions.forEach((option) => {
        if (option.value === selectedPrompt) return;
        answerSelect.appendChild(option.cloneNode(true));
      });

      // Reset to first placeholder option
      if (answerSelect.options.length > 0) {
        answerSelect.selectedIndex = 0;
      }
    });
  }
}








