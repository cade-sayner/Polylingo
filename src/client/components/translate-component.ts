import { apiFetch, deleteTranslationQuestion, fetchLanguages, getExistingTranslationQuestions } from "../api-client";
import { BaseComponent, BaseInstructorComponent } from "../types";
import { setupDistractorInput, AutocompleteService, populateLanguageDropdown, getElement, populateAnswerWord } from "../utils";

export class TranslationComponent implements BaseInstructorComponent {
  private languages: {language_id: number, language_name: string}[] = [];
  private currentAnswerWordId : number | null = null;
  private currentPromptWordId : number | null = null;
  public selectedPromptLanguageId: number | null = null;
  public selectedAnswerLanguageId: number | null = null;

  render() {
    return document.querySelector("#translate-component")?.innerHTML ?? "";
  }

  async mount() {

    this.languages = await fetchLanguages();
    populateLanguageDropdown("answerLanguage", this.languages);
    populateLanguageDropdown("promptLanguage", this.languages);
    this.setupInitialUIState()
    this.setupAutocomplete(
      "promptWord",
      "promptDropdown",
      "promptWordId",
      "clearPromptBtn",
      () => this.selectedPromptLanguageId,
      (selectedItem) => {
        this.currentPromptWordId = selectedItem.id;
        populateAnswerWord(selectedItem.word, selectedItem.id, "promptWord", "promptWordId", "clearPromptBtn");
      }
    );
    setupDistractorInput()
    this.setupAutocomplete(
      "answerWord",
      "answerDropdown",
      "answerWordId",
      "clearAnswerBtn",
      () => this.selectedAnswerLanguageId,
      (selectedItem) => {
        this.currentAnswerWordId = selectedItem.id;
        populateAnswerWord(selectedItem.word, selectedItem.id, "answerWord", "answerWordId", "clearAnswerBtn");
        this.loadExistingQuestions();
      }
    );
    this.setupEventListeners()
    this.loadExistingQuestions();
  }

  private setupInitialUIState() {
    const answerInput = getElement<HTMLInputElement>("answerWord");
    const createBtn = getElement<HTMLButtonElement>(".create-question-btn");

    answerInput.disabled = false;
    createBtn.disabled = true;
  }

  private setupEventListeners() {
    this.setupLanguageSelectListener("answerLanguage");
    this.setupLanguageSelectListener("promptLanguage");
    this.setupClearListener();
    this.setupCreateButtonListener();
    this.setupDistractorInputListener();
    this.setupEnterKeyForAutocomplete("answerWord", "answerDropdown");
    this.setupEnterKeyForAutocomplete("promptWord", "promptDropdown");
  }

  private setupAutocomplete(
    wordElementID: string,
    dropdownId: string,
    elementId: string,
    buttonElement: string,
    getLanguageId: () => number | null,
    onSelect: (selectedItem: { word: string; id: number }) => void
  ) {
    AutocompleteService.setupForComponent(
      getLanguageId,
      wordElementID,
      dropdownId,
      (selectedItem) => {
        onSelect(selectedItem);
      }
    );
  }


  private updateLanguageDropdowns() {
    const promptSelect = getElement<HTMLSelectElement>("promptLanguage");
    const answerSelect = getElement<HTMLSelectElement>("answerLanguage");

    const promptVal = parseInt(promptSelect.value);
    const answerVal = parseInt(answerSelect.value);

    for (const option of promptSelect.options) {
      option.disabled = parseInt(option.value) === answerVal;
    }

    for (const option of answerSelect.options) {
      option.disabled = parseInt(option.value) === promptVal;
    }
  }


  private setupLanguageSelectListener(element: string) {
    const languageSelect = getElement<HTMLSelectElement>(element);

    if (element === "answerLanguage" && this.selectedAnswerLanguageId) {
      languageSelect.value = this.selectedAnswerLanguageId.toString();
    }
    if (element === "promptLanguage" && this.selectedPromptLanguageId) {
      languageSelect.value = this.selectedPromptLanguageId.toString();
    }

    languageSelect.addEventListener("change", () => {
      const val = parseInt(languageSelect.value) || null;

      if (element === "answerLanguage") {
        this.selectedAnswerLanguageId = val;
        this.resetFormOnLanguageChange("answerWord", "answerWordId", "clearAnswerBtn");
      } else if (element === "promptLanguage") {
        this.selectedPromptLanguageId = val;
        this.resetFormOnLanguageChange("promptWord", "promptWordId", "clearPromptBtn");
      }

      this.updateLanguageDropdowns();
    });

  }

  private setupDistractorInputListener() {
    const distractorInput = getElement<HTMLInputElement>("distractorInput");
    const createBtn = getElement<HTMLButtonElement>(".create-question-btn");

    distractorInput.addEventListener("input", () => {
      createBtn.disabled = distractorInput.value.trim().length === 0;
    });
  }

  private resetFormOnLanguageChange(element: string, elementId: string, clearOpbtn: string) {
    const answerInput = getElement<HTMLInputElement>(element);
    const hiddenInput = getElement<HTMLInputElement>(elementId);
    const clearBtn = getElement<HTMLButtonElement>(clearOpbtn);
    const distractorInput = getElement<HTMLInputElement>("distractorInput");
    const createBtn = getElement<HTMLButtonElement>(".create-question-btn");
    const tbody = getElement<HTMLTableSectionElement>("existing-translations-body");

    answerInput.value = "";
    hiddenInput.value = "";
    clearBtn.style.display = "none";
    answerInput.disabled = false;
    answerInput.readOnly = false;
    distractorInput.value = "";
    createBtn.disabled = true;
    tbody.innerHTML = "";
  }

  private setupClearListener() {
    const clearAnswerBtn = getElement<HTMLButtonElement>("clearAnswerBtn");
    const clearPromptBtn = getElement<HTMLButtonElement>("clearPromptBtn");

    clearAnswerBtn.addEventListener("click", () => {
      this.clearWord("answerWord", "answerWordId", "existing-translations-body");
      clearAnswerBtn.style.display = "none";
    });
    clearPromptBtn.addEventListener("click", () => {
      this.clearWord("promptWord", "promptWordId", "existing-translations-body");
      clearPromptBtn.style.display = "none";
    });
  }

  private clearWord(element: string, elementId: string, tableId: string) {
    const input = getElement<HTMLInputElement>(element);
    const hiddenInput = getElement<HTMLInputElement>(elementId);
    const tbody = getElement<HTMLTableSectionElement>(tableId);

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
        this.createTranslationBlank();
      }
    });
  }

  deleteTranslation(id : number, word: string) {
    const confirmation = confirm(`Deleting question for word: ${word}. Are you sure you want to continue?`);
    if (confirmation) 
    {
      deleteTranslationQuestion(id);
      this.loadExistingQuestions()
    }
  }

  async loadExistingQuestions() {
      if (!this.currentAnswerWordId) return;
  
      const existingQuestions = await getExistingTranslationQuestions(this.currentAnswerWordId);
      const tbody = getElement<HTMLTableSectionElement>("existing-translations-body");
  
      tbody.innerHTML = "";
      if (!existingQuestions || existingQuestions.length === 0) {
        tbody.innerHTML = `<tr><td>No questions found for answer word.</td></tr>`;
        return;
      }
  
      existingQuestions.forEach((q) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${q.quesword}</td>
          <td>${q.answord}</td>
          <td>${q.distractors.join(", ")}</td>
          <td>${q.difficultyScore}</td>
          <td><button class="delete-btn">Delete</button></td>
        `;
        tbody.appendChild(tr);
  
        tr.querySelector(".delete-btn")?.addEventListener("click", () =>
          this.deleteTranslation(q.translationQuestionId, q.answerWord)
        );
      });
    }

  private setupEnterKeyForAutocomplete(element: string, dropdownid: string) {
    const input = getElement<HTMLInputElement>(element); 
    const dropdown = getElement<HTMLDivElement>(dropdownid);

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

  async createTranslationBlank() {
    const answerWordId = this.currentAnswerWordId;
    const promptWordId = this.currentPromptWordId;

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

      console.log(JSON.stringify(payload))

      await apiFetch("/api/translationquestions", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      });

      
      alert("Translation question created successfully.");
      this.loadExistingQuestions();
      
    } 
    catch (error) {
      alert("Failed to create question. Please try again.");
    }
  }
    
}
