import { apiFetch, deleteTranslationQuestion, fetchLanguages, getExistingTranslationQuestions } from "../api-client";
import { setupDistractorInput, AutocompleteService, populateLanguageDropdown, getElement, populateAnswerWord } from "../utils";
export class TranslationComponent {
    constructor() {
        this.languages = [];
        this.currentAnswerWordId = null;
        this.currentPromptWordId = null;
        this.selectedPromptLanguageId = null;
        this.selectedAnswerLanguageId = null;
    }
    render() {
        var _a, _b;
        return (_b = (_a = document.querySelector("#translate-component")) === null || _a === void 0 ? void 0 : _a.innerHTML) !== null && _b !== void 0 ? _b : "";
    }
    async mount() {
        this.languages = await fetchLanguages();
        populateLanguageDropdown("answerLanguage", this.languages);
        populateLanguageDropdown("promptLanguage", this.languages);
        this.setupInitialUIState();
        this.setupAutocomplete("promptWord", "promptDropdown", "promptWordId", "clearPromptBtn", () => this.selectedPromptLanguageId, (selectedItem) => {
            this.currentPromptWordId = selectedItem.id;
            populateAnswerWord(selectedItem.word, selectedItem.id, "promptWord", "promptWordId", "clearPromptBtn");
        });
        setupDistractorInput();
        this.setupAutocomplete("answerWord", "answerDropdown", "answerWordId", "clearAnswerBtn", () => this.selectedAnswerLanguageId, (selectedItem) => {
            this.currentAnswerWordId = selectedItem.id;
            populateAnswerWord(selectedItem.word, selectedItem.id, "answerWord", "answerWordId", "clearAnswerBtn");
            this.loadExistingQuestions();
        });
        this.setupEventListeners();
        this.loadExistingQuestions();
    }
    setupInitialUIState() {
        const answerInput = getElement("answerWord");
        const createBtn = getElement(".create-question-btn");
        answerInput.disabled = false;
        createBtn.disabled = true;
    }
    setupEventListeners() {
        this.setupLanguageSelectListener("answerLanguage");
        this.setupLanguageSelectListener("promptLanguage");
        this.setupClearListener();
        this.setupCreateButtonListener();
        this.setupDistractorInputListener();
        this.setupEnterKeyForAutocomplete("answerWord", "answerDropdown");
        this.setupEnterKeyForAutocomplete("promptWord", "promptDropdown");
    }
    setupAutocomplete(wordElementID, dropdownId, elementId, buttonElement, getLanguageId, onSelect) {
        AutocompleteService.setupForComponent(getLanguageId, wordElementID, dropdownId, (selectedItem) => {
            onSelect(selectedItem);
        });
    }
    updateLanguageDropdowns() {
        const promptSelect = getElement("promptLanguage");
        const answerSelect = getElement("answerLanguage");
        const promptVal = parseInt(promptSelect.value);
        const answerVal = parseInt(answerSelect.value);
        for (const option of promptSelect.options) {
            option.disabled = parseInt(option.value) === answerVal;
        }
        for (const option of answerSelect.options) {
            option.disabled = parseInt(option.value) === promptVal;
        }
    }
    setupLanguageSelectListener(element) {
        const languageSelect = getElement(element);
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
            }
            else if (element === "promptLanguage") {
                this.selectedPromptLanguageId = val;
                this.resetFormOnLanguageChange("promptWord", "promptWordId", "clearPromptBtn");
            }
            this.updateLanguageDropdowns();
        });
    }
    setupDistractorInputListener() {
        const distractorInput = getElement("distractorInput");
        const createBtn = getElement(".create-question-btn");
        distractorInput.addEventListener("input", () => {
            createBtn.disabled = distractorInput.value.trim().length === 0;
        });
    }
    resetFormOnLanguageChange(element, elementId, clearOpbtn) {
        const answerInput = getElement(element);
        const hiddenInput = getElement(elementId);
        const clearBtn = getElement(clearOpbtn);
        const distractorInput = getElement("distractorInput");
        const createBtn = getElement(".create-question-btn");
        const tbody = getElement("existing-translations-body");
        answerInput.value = "";
        hiddenInput.value = "";
        clearBtn.style.display = "none";
        answerInput.disabled = false;
        answerInput.readOnly = false;
        distractorInput.value = "";
        createBtn.disabled = true;
        tbody.innerHTML = "";
    }
    setupClearListener() {
        const clearAnswerBtn = getElement("clearAnswerBtn");
        const clearPromptBtn = getElement("clearPromptBtn");
        clearAnswerBtn.addEventListener("click", () => {
            this.clearWord("answerWord", "answerWordId", "existing-translations-body");
            clearAnswerBtn.style.display = "none";
        });
        clearPromptBtn.addEventListener("click", () => {
            this.clearWord("promptWord", "promptWordId", "existing-translations-body");
            clearPromptBtn.style.display = "none";
        });
    }
    clearWord(element, elementId, tableId) {
        const input = getElement(element);
        const hiddenInput = getElement(elementId);
        const tbody = getElement(tableId);
        input.value = "";
        hiddenInput.value = "";
        input.readOnly = false;
        this.currentAnswerWordId = null;
        tbody.innerHTML = "";
    }
    setupCreateButtonListener() {
        const createBtn = getElement(".create-question-btn");
        createBtn.addEventListener("click", (e) => {
            const hiddenInput = getElement("answerWordId");
            if (!hiddenInput.value) {
                e.preventDefault();
                alert("You must select an answer word from suggestions.");
            }
            else {
                this.createTranslationBlank();
            }
        });
    }
    deleteTranslation(id, word) {
        const confirmation = confirm(`Deleting question for word: ${word}. Are you sure you want to continue?`);
        if (confirmation) {
            deleteTranslationQuestion(id);
            this.loadExistingQuestions();
        }
    }
    async loadExistingQuestions() {
        if (!this.currentAnswerWordId)
            return;
        const existingQuestions = await getExistingTranslationQuestions(this.currentAnswerWordId);
        const tbody = getElement("existing-translations-body");
        tbody.innerHTML = "";
        if (!existingQuestions || existingQuestions.length === 0) {
            tbody.innerHTML = `<tr><td>No questions found for answer word.</td></tr>`;
            return;
        }
        existingQuestions.forEach((q) => {
            var _a;
            const tr = document.createElement("tr");
            tr.innerHTML = `
          <td>${q.quesword}</td>
          <td>${q.answord}</td>
          <td>${q.distractors.join(", ")}</td>
          <td>${q.difficultyScore}</td>
          <td><button class="delete-btn">Delete</button></td>
        `;
            tbody.appendChild(tr);
            (_a = tr.querySelector(".delete-btn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => this.deleteTranslation(q.translationQuestionId, q.answerWord));
        });
    }
    setupEnterKeyForAutocomplete(element, dropdownid) {
        const input = getElement(element);
        const dropdown = getElement(dropdownid);
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                const firstItem = dropdown.querySelector(".autocomplete-item");
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
        const distractorInput = document.getElementById("distractorsHidden");
        const difficultyInput = document.getElementById("difficulty");
        const distractors = distractorInput === null || distractorInput === void 0 ? void 0 : distractorInput.value.split(",").map(d => d.trim()).filter(d => d !== "");
        const difficulty = difficultyInput === null || difficultyInput === void 0 ? void 0 : difficultyInput.value;
        if (!promptWordId) {
            alert("Please select an existing prompt word.");
            return;
        }
        if (!answerWordId) {
            alert("Please select an existing answer word.");
            return;
        }
        if (!difficulty) {
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
            console.log(JSON.stringify(payload));
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
