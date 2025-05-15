import { apiFetch, deleteTranslationQuestion, getExistingTranslationQuestions } from "../api-client";
import { BaseComponent } from "../types";
import { setupDistractorInput, AutocompleteService } from "../utils";

export class TranslationComponent implements BaseComponent {
  private currentAnswerWordId : number | null = 20;
  private promptWordId : number | null = 20;

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

    this.loadExistingQuestions(80);
  }

  deleteTranslation(id : number, word: string, answerWordId: number) {
    const confirmation = confirm(`Deleting question for word: ${word}. Are you sure you want to continue?`);
    if (confirmation) 
    {
      deleteTranslationQuestion(id);
      this.loadExistingQuestions(answerWordId)
    }
  }

  async loadExistingQuestions(answerWordId : number = 20) {
    const existingQuestions = await getExistingTranslationQuestions(answerWordId);
    const tbody = document.getElementById('existing-translations-body');
    if (tbody == null || existingQuestions == null)
      return
    if (existingQuestions.length != 0)
    {
      tbody.innerHTML = '';
      existingQuestions.forEach(q => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
        <td>${q.quesword}</td>
        <td>${q.answord}</td>
        <td>${q.distractors.join(', ')}</td>
        <td>${q.difficultyScore}</td>
        <td>
            <button class="delete-btn">Delete</button>
        </td>
        `;
        tbody.appendChild(tr);
        const deleteBtn = tr.querySelector('.delete-btn') as HTMLButtonElement;
        deleteBtn.addEventListener('click', () => this.deleteTranslation(q.translationQuestionId, q.answord!, answerWordId));
      });
    }
    else
    {
      tbody.innerHTML = '';
      const tr = document.createElement('tr');
      tr.innerHTML = `
      <td>No questions found for answer word.</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      `;
      tbody.appendChild(tr);
    }
  }

  async createFillBlank() {
    const answerWordId = this.currentAnswerWordId;
    const promptWordId = this.promptWordId;

    const distractorInput = document.getElementById("distractorsHidden") as HTMLInputElement;
    const difficultyInput = document.getElementById("difficulty") as HTMLSelectElement;

    const distractors = distractorInput?.value.split(",").map(d => d.trim()).filter(d => d !== "");
    const difficulty = difficultyInput?.value;

    if (!promptWordId) {
      alert("Please select an existing prompt word.");
      return;
    }
    if (!answerWordId) {
      alert("Please select an existing answer word.");
      return;
    }
    if (!difficulty)
    {
      alert("A difficulty level must be selected.");
      return;
    }
    if (!distractors || distractors.length === 0) {
      alert("At least one distractor is required.");
      return;
    }

    try {
      const payload = {
        answerWordId,
        promptWordId,
        distractors,
        difficultyScore: parseInt(difficulty)
      };

      const result = await apiFetch("/api/translationquestions", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      });

      if (result.status = 201) {
        alert("Translation question created successfully.");
        this.loadExistingQuestions(answerWordId);
      }
      else {
        alert(`Failed to create question: ${result.message}`);
      }
    } 
    catch (error) {
      alert("Failed to create question. Please try again.");
    }
  }
    
}








