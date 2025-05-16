// fillInTheBlankComponent.ts
import {
  apiFetch,
  deleteFillBlankQuestion,
  fetchLanguages,
  getExistingFillBlankQuestions,
} from "../api-client";
import {
  BaseComponent,
  BaseInstructorComponent,
  FillBlankQuestion,
  Language,
} from "../types";
import {
  setupDistractorInput,
  AutocompleteService,
  populateLanguageDropdown,
  getElement,
  populateAnswerWord
} from "../utils";

export class FillInTheBlankComponent implements BaseInstructorComponent {
  private languages: {language_id: number, language_name: string}[] = [];;
  public selectedLanguageId: number | null = null;
  private currentAnswerWordId: number | null = null;

  render() {
    return document.querySelector("#fill-blank-component")?.innerHTML ?? "";
  }

  async mount() {
    this.languages = await fetchLanguages();
    populateLanguageDropdown("answerLanguage", this.languages);
    this.setupInitialUIState();
    this.setupEventListeners();
    setupDistractorInput();
    this.setupAutocomplete("answerWord", "autocompleteDropdown", "answerWordId", "clearAnswerBtn", () => this.selectedLanguageId);
  }

  private setupInitialUIState() {
    const answerInput = getElement<HTMLInputElement>("answerWord");
    const createBtn = getElement<HTMLButtonElement>(".create-question-btn");

    answerInput.disabled = true;
    createBtn.disabled = true;
  }

  private setupEventListeners() {
    this.setupLanguageSelectListener();
    this.setupClearAnswerListener();
    this.setupCreateButtonListener();
    this.setupDistractorInputListener();
    this.setupEnterKeyForAutocomplete();
  }

  private setupAutocomplete(wordElementID: string, dropdownId: string, elementId: string, buttonElement: string, getLanguageId: () => number | null) {
    AutocompleteService.setupForComponent(
      getLanguageId,
      wordElementID,
      dropdownId,
      (selectedItem) => {
        this.currentAnswerWordId = selectedItem.id;
        populateAnswerWord(selectedItem.word, selectedItem.id, wordElementID, elementId, buttonElement);
        this.loadExistingQuestions();
      }
    );
  }

  private setupLanguageSelectListener() {
    const languageSelect = getElement<HTMLSelectElement>("answerLanguage");

    if (this.selectedLanguageId) {
      languageSelect.value = this.selectedLanguageId.toString();
    }

    languageSelect.addEventListener("change", () => {
      this.selectedLanguageId = parseInt(languageSelect.value) || null;
      this.resetFormOnLanguageChange();
    });
  }

  private resetFormOnLanguageChange() {
    const answerInput = getElement<HTMLInputElement>("answerWord");
    const hiddenInput = getElement<HTMLInputElement>("answerWordId");
    const clearBtn = getElement<HTMLButtonElement>("clearAnswerBtn");
    const distractorInput = getElement<HTMLInputElement>("distractorInput");
    const createBtn = getElement<HTMLButtonElement>(".create-question-btn");
    const tbody = getElement<HTMLTableSectionElement>("existing-fill-blank-body");

    answerInput.value = "";
    hiddenInput.value = "";
    clearBtn.style.display = "none";
    answerInput.disabled = false;
    answerInput.readOnly = false;
    distractorInput.value = "";
    createBtn.disabled = true;
    tbody.innerHTML = "";
  }

  private setupClearAnswerListener() {
    const clearBtn = getElement<HTMLButtonElement>("clearAnswerBtn");

    clearBtn.addEventListener("click", () => {
      this.clearAnswerWord();
      clearBtn.style.display = "none";
    });
  }

  private clearAnswerWord() {
    const input = getElement<HTMLInputElement>("answerWord");
    const hiddenInput = getElement<HTMLInputElement>("answerWordId");
    const tbody = getElement<HTMLTableSectionElement>("existing-fill-blank-body");

    input.value = "";
    hiddenInput.value = "";
    input.readOnly = false;
    this.currentAnswerWordId = null;
    tbody.innerHTML = "";
  }

  private setupCreateButtonListener() {
    const createBtn = getElement<HTMLButtonElement>(".create-question-btn");

    createBtn.addEventListener("click", (e) => {
      const hiddenInput = getElement<HTMLInputElement>("answerWordId");
      if (!hiddenInput.value) {
        e.preventDefault();
        alert("You must select an answer word from suggestions.");
      } else {
        this.createFillBlank();
      }
    });
  }

  private setupDistractorInputListener() {
    const distractorInput = getElement<HTMLInputElement>("distractorInput");
    const createBtn = getElement<HTMLButtonElement>(".create-question-btn");

    distractorInput.addEventListener("input", () => {
      createBtn.disabled = distractorInput.value.trim().length === 0;
    });
  }

  private setupEnterKeyForAutocomplete() {
    const input = getElement<HTMLInputElement>("answerWord");
    const dropdown = getElement<HTMLDivElement>("autocompleteDropdown");

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const firstItem = dropdown.querySelector<HTMLDivElement>(".autocomplete-item");
        if (firstItem) {
          e.preventDefault();
          firstItem.click();
          input.blur();
        }
      }
    });
  }

  async loadExistingQuestions() {
    if (!this.currentAnswerWordId) return;

    const existingQuestions = await getExistingFillBlankQuestions(this.currentAnswerWordId);
    const tbody = getElement<HTMLTableSectionElement>("existing-fill-blank-body");

    tbody.innerHTML = "";
    if (!existingQuestions || existingQuestions.length === 0) {
      tbody.innerHTML = `<tr><td>No questions found for answer word.</td></tr>`;
      return;
    }

    existingQuestions.forEach((q) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${q.placeholderSentence}</td>
        <td>${q.word}</td>
        <td>${q.distractors.join(", ")}</td>
        <td>${q.difficultyScore}</td>
        <td><button class="delete-btn">Delete</button></td>
      `;
      tbody.appendChild(tr);

      tr.querySelector(".delete-btn")?.addEventListener("click", () =>
        this.deleteFillBlank(q.fillBlankQuestionsId, q.word)
      );
    });
  }

  async deleteFillBlank(id: number, word: string) {
    if (confirm(`Deleting question for word: ${word}. Are you sure?`)) {
      await deleteFillBlankQuestion(id);
      this.loadExistingQuestions();
    }
  }

  async createFillBlank() {
    const answerWordId = this.currentAnswerWordId;
    const distractors = getElement<HTMLInputElement>("distractorsHidden")
      .value.split(",")
      .map((d) => d.trim())
      .filter((d) => d);

    const sentence = getElement<HTMLInputElement>("questionSentence").value.trim();
    const difficulty = getElement<HTMLSelectElement>("difficulty").value;

    if (!answerWordId || !sentence || !sentence.includes("_") || !difficulty || distractors.length !== 3) {
      alert("Ensure all fields are valid and exactly 3 distractors are provided. Sentence must contain '_'.");
      return;
    }

    const payload = {
      missingWordId: answerWordId,
      distractors,
      placeholderSentence: sentence.replace("_", "____"),
      difficultyScore: parseInt(difficulty),
    };

    try {
      console.log(JSON.stringify(payload))
      await apiFetch("/api/fill_blank", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      });

        alert("Question created successfully.");
        this.loadExistingQuestions();
    } catch (error) {
      alert(`Failed to create question: ${error}`);
    }
  }
}