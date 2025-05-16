// fillInTheBlankComponent.ts
import { apiFetch, deleteFillBlankQuestion, fetchLanguages, getExistingFillBlankQuestions, } from "../api-client";
import { setupDistractorInput, AutocompleteService, populateLanguageDropdown, getElement, populateAnswerWord } from "../utils";
export class FillInTheBlankComponent {
    constructor() {
        this.languages = [];
        this.selectedLanguageId = null;
        this.currentAnswerWordId = null;
    }
    ;
    render() {
        var _a, _b;
        return (_b = (_a = document.querySelector("#fill-blank-component")) === null || _a === void 0 ? void 0 : _a.innerHTML) !== null && _b !== void 0 ? _b : "";
    }
    async mount() {
        this.languages = await fetchLanguages();
        populateLanguageDropdown("answerLanguage", this.languages);
        this.setupInitialUIState();
        this.setupEventListeners();
        setupDistractorInput();
        this.setupAutocomplete("answerWord", "autocompleteDropdown", "answerWordId", "clearAnswerBtn", () => this.selectedLanguageId);
    }
    setupInitialUIState() {
        const answerInput = getElement("answerWord");
        const createBtn = getElement(".create-question-btn");
        answerInput.disabled = true;
        createBtn.disabled = true;
    }
    setupEventListeners() {
        this.setupLanguageSelectListener();
        this.setupClearAnswerListener();
        this.setupCreateButtonListener();
        this.setupDistractorInputListener();
        this.setupEnterKeyForAutocomplete();
    }
    setupAutocomplete(wordElementID, dropdownId, elementId, buttonElement, getLanguageId) {
        AutocompleteService.setupForComponent(getLanguageId, wordElementID, dropdownId, (selectedItem) => {
            this.currentAnswerWordId = selectedItem.id;
            populateAnswerWord(selectedItem.word, selectedItem.id, wordElementID, elementId, buttonElement);
            this.loadExistingQuestions();
        });
    }
    setupLanguageSelectListener() {
        const languageSelect = getElement("answerLanguage");
        if (this.selectedLanguageId) {
            languageSelect.value = this.selectedLanguageId.toString();
        }
        languageSelect.addEventListener("change", () => {
            this.selectedLanguageId = parseInt(languageSelect.value) || null;
            this.resetFormOnLanguageChange();
        });
    }
    resetFormOnLanguageChange() {
        const answerInput = getElement("answerWord");
        const hiddenInput = getElement("answerWordId");
        const clearBtn = getElement("clearAnswerBtn");
        const distractorInput = getElement("distractorInput");
        const createBtn = getElement(".create-question-btn");
        const tbody = getElement("existing-fill-blank-body");
        answerInput.value = "";
        hiddenInput.value = "";
        clearBtn.style.display = "none";
        answerInput.disabled = false;
        answerInput.readOnly = false;
        distractorInput.value = "";
        createBtn.disabled = true;
        tbody.innerHTML = "";
    }
    setupClearAnswerListener() {
        const clearBtn = getElement("clearAnswerBtn");
        clearBtn.addEventListener("click", () => {
            this.clearAnswerWord();
            clearBtn.style.display = "none";
        });
    }
    clearAnswerWord() {
        const input = getElement("answerWord");
        const hiddenInput = getElement("answerWordId");
        const tbody = getElement("existing-fill-blank-body");
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
                this.createFillBlank();
            }
        });
    }
    setupDistractorInputListener() {
        const distractorInput = getElement("distractorInput");
        const createBtn = getElement(".create-question-btn");
        distractorInput.addEventListener("input", () => {
            createBtn.disabled = distractorInput.value.trim().length === 0;
        });
    }
    setupEnterKeyForAutocomplete() {
        const input = getElement("answerWord");
        const dropdown = getElement("autocompleteDropdown");
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
    async loadExistingQuestions() {
        if (!this.currentAnswerWordId)
            return;
        const existingQuestions = await getExistingFillBlankQuestions(this.currentAnswerWordId);
        const tbody = getElement("existing-fill-blank-body");
        tbody.innerHTML = "";
        if (!existingQuestions || existingQuestions.length === 0) {
            tbody.innerHTML = `<tr><td>No questions found for answer word.</td></tr>`;
            return;
        }
        existingQuestions.forEach((q) => {
            var _a;
            const tr = document.createElement("tr");
            tr.innerHTML = `
        <td>${q.placeholderSentence}</td>
        <td>${q.word}</td>
        <td>${q.distractors.join(", ")}</td>
        <td>${q.difficultyScore}</td>
        <td><button class="delete-btn">Delete</button></td>
      `;
            tbody.appendChild(tr);
            (_a = tr.querySelector(".delete-btn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => this.deleteFillBlank(q.fillBlankQuestionsId, q.word));
        });
    }
    async deleteFillBlank(id, word) {
        if (confirm(`Deleting question for word: ${word}. Are you sure?`)) {
            await deleteFillBlankQuestion(id);
            this.loadExistingQuestions();
        }
    }
    async createFillBlank() {
        const answerWordId = this.currentAnswerWordId;
        const distractors = getElement("distractorsHidden")
            .value.split(",")
            .map((d) => d.trim())
            .filter((d) => d);
        const sentence = getElement("questionSentence").value.trim();
        const difficulty = getElement("difficulty").value;
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
            console.log(JSON.stringify(payload));
            await apiFetch("/api/fill_blank", {
                method: "POST",
                body: JSON.stringify(payload),
                headers: { "Content-Type": "application/json" },
            });
            alert("Question created successfully.");
            this.loadExistingQuestions();
        }
        catch (error) {
            alert(`Failed to create question: ${error}`);
        }
    }
}
