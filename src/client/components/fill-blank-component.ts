import { apiFetch, deleteFillBlankQuestion, getExistingFillBlankQuestions } from "../api-client";
import { BaseComponent } from "../types";
import { setupDistractorInput, AutocompleteService } from "../utils";

export class FillInTheBlankComponent implements BaseComponent {
  private languages: {language_id: number, language_name: string}[] = [];
  public selectedLanguageId: number | null = null;
  private currentAnswerWordId : number | null = 20;

  render() {
    return document.querySelector("#fill-blank-component")?.innerHTML ?? "";
  }

  async mount() {
    await this.loadLanguages();
    this.populateLanguageDropdown();
    this.setupLanguageSelection();
    this.setupFieldDependencies();
    this.setupClearAnswerButton();
    setupDistractorInput();

    AutocompleteService.setupForComponent(
        this,
        "answerWord",
        "autocompleteDropdown",
        (selectedItem) => {
        this.currentAnswerWordId = selectedItem.id;
        this.loadExistingQuestions(selectedItem.id);
        const input      = document.getElementById("answerWord")    as HTMLInputElement;
        const hiddenInput= document.getElementById("answerWordId")  as HTMLInputElement;
        const clearBtn   = document.getElementById("clearAnswerBtn") as HTMLButtonElement;

        input.value    = selectedItem.word;
        hiddenInput.value = selectedItem.id.toString();

        input.readOnly = true;
        clearBtn.style.display = "inline-block";
        }
    );

    console.log(this.currentAnswerWordId)

    const input    = document.getElementById("answerWord") as HTMLInputElement;
    const dropdown = document.getElementById("autocompleteDropdown") as HTMLDivElement;

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


  private setupFieldDependencies() {
    const languageSelect = document.getElementById("answerLanguage") as HTMLSelectElement;
    const answerInput = document.getElementById("answerWord") as HTMLInputElement;
    const distractorInput = document.getElementById("distractorInput") as HTMLInputElement;
    const createBtn = document.querySelector(".create-question-btn") as HTMLButtonElement;
    createBtn.addEventListener("click", (e) => {
    const hiddenInput = document.getElementById("answerWordId") as HTMLInputElement;
    if (!hiddenInput.value) {
        e.preventDefault();
        alert("You must select an answer word from suggestions.");
    }
    });
 
    answerInput.disabled = true;
    createBtn.disabled = true;

    languageSelect.addEventListener("change", () => {
      if (languageSelect.value) {
        answerInput.disabled = false;
      }
    });

    distractorInput.addEventListener("input", () => {
      const hasDistractors = distractorInput.value.trim().length > 0;
      createBtn.disabled = !hasDistractors;
    });

    createBtn.addEventListener("click", () => {
      this.createFillBlank();
    })
  }

  private setupClearAnswerButton() {
    const clearBtn = document.getElementById("clearAnswerBtn") as HTMLButtonElement;
    const input = document.getElementById("answerWord") as HTMLInputElement;
    const hiddenInput = document.getElementById("answerWordId") as HTMLInputElement;

    clearBtn.addEventListener("click", () => {
        input.value = "";
        hiddenInput.value = "";
        input.readOnly = false;
        clearBtn.style.display = "none";
    });
    }


  private populateLanguageDropdown() {
    const select = document.getElementById("answerLanguage") as HTMLSelectElement;
    if (select) {
      select.innerHTML = `
        <option value="" disabled selected>Language</option>
        ${this.languages.map(lang => 
          `<option value="${lang.language_id}">${lang.language_name}</option>`
        ).join('')}
      `;
    }
  }

  private async loadLanguages() {
    try {
      const response = await apiFetch("/api/languages");
      this.languages = (await response).map((lang: any) => ({
        language_id: lang.languageId,
        language_name: lang.languageName
      }));
    } catch (error) {
      console.error("Failed to load languages:", error);
      this.languages = [];
    }
  }

  private setupLanguageSelection() {
    const select = document.getElementById("answerLanguage") as HTMLSelectElement;
    if (select) {
      if (this.selectedLanguageId) {
        select.value = this.selectedLanguageId.toString();
      }

      console.log(this.selectedLanguageId)
      
      select.addEventListener('change', () => {
        this.selectedLanguageId = select.value ? parseInt(select.value) : null;
        console.log('Selected language ID:', this.selectedLanguageId);
      });
    }
  }

  deleteFillBlank(id : number, word: string, answerWordId: number) {
    const confirmation = confirm(`Deleting question for word: ${word}. Are you sure you want to continue?`);
    if (confirmation) 
    {
      deleteFillBlankQuestion(id);
      this.loadExistingQuestions(answerWordId)
    }
  }

  async loadExistingQuestions(answerWordId : number = 20) {
    const existingQuestions = await getExistingFillBlankQuestions(answerWordId);
    const tbody = document.getElementById('existing-fill-blank-body');
    if (tbody == null || existingQuestions == null)
        return
    if (existingQuestions.length != 0)
    {
      tbody.innerHTML = '';
      existingQuestions.forEach(q => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
        <td>${q.placeholderSentence}</td>
        <td>${q.word}</td>
        <td>${q.distractors.join(', ')}</td>
        <td>${q.difficultyScore}</td>
        <td>
            <button class="delete-btn">Delete</button>
        </td>
        `;
        tbody.appendChild(tr);
        const deleteBtn = tr.querySelector('.delete-btn') as HTMLButtonElement;
        deleteBtn.addEventListener('click', () => this.deleteFillBlank(q.fillBlankQuestionsId, q.word, answerWordId));
      });
    }
    else
    {
      tbody.innerHTML = '';
      const tr = document.createElement('tr');
      tr.innerHTML = `
      <td>No questions found for answer word.</td>
      `;
      tbody.appendChild(tr);
    }
  }

  async createFillBlank() {
    const answerWordId = this.currentAnswerWordId;

    const distractorInput = document.getElementById("distractorsHidden") as HTMLInputElement;
    const sentenceInput = document.getElementById("questionSentence") as HTMLInputElement;
    const difficultyInput = document.getElementById("difficulty") as HTMLSelectElement;

    const distractors = distractorInput?.value.split(",").map(d => d.trim()).filter(d => d !== "");
    const sentence = sentenceInput?.value.trim();
    const difficulty = difficultyInput?.value;

    if (!answerWordId) {
      alert("Please select an existing answer word.");
      return;
    }
    if (!sentence) {
      alert("Please enter a sentence for the question.");
      return;
    }
    if (!sentence.includes('_'))
    {
      alert("Question sentence should include an '_' for the missing word.")
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
        missingWordId: answerWordId,
        distractors,
        placeholderSentence: sentence,
        difficultyScore: parseInt(difficulty)
      };

      const result = await apiFetch("/api/fill_blank", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      });

      if (result.status = 201) {
        alert("Fill in the blank question created successfully.");
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