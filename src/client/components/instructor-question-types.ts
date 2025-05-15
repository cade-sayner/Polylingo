import { apiFetch } from "../api-client";
import { BaseComponent } from "../types";

export class FillInTheBlankComponent implements BaseComponent {
  private languages: {language_id: number, language_name: string}[] = [];
  public selectedLanguageId: number | null = null;  // <-- Add this variable

  render() {
    return `
      <div class="translation-container">
        <h2 class="section-title">Fill in the blank questions</h2>

        <form class="translation-form" autocomplete="off">
          <div class="form-group">
          <label for="answerLanguage">Language</label>
          <select name="answer-language" id="answerLanguage" class="form-control">
            <option value="" disabled selected>Language</option>
          </select>
        </div>

        <div class="form-group">
          <label for="promptWord">Question Sentence</label>
          <input type="text" placeholder="Use ___ for blank" name="promptWord" id="promptWord" class="form-control" />
        </div>

        <div class="form-group">
          <label for="difficulty">Difficulty</label>
          <select name="difficulty" id="difficulty" class="form-control">
            <option value="" disabled selected>Difficulty</option>
            <option value="1">1 - Very Easy</option>
            <option value="2">2 - Easy</option>
            <option value="3">3 - Medium</option>
            <option value="4">4 - Hard</option>
          </select>
        </div>

        <div class="form-group">
          <label for="answerWord">Answer Word</label>
          <div class="autocomplete">
            <input type="text" id="answerWord" placeholder="Missing word" name="answerWord">
            <div id="autocompleteDropdown" class="autocomplete-items"></div>
          </div>
        </div>
          
          <div id="distractorInputWrapperFillBlank">
            <input
              type="text"
              id="distractorInput"
              class="distractor-input"
              placeholder="Enter three distractors"
            />
            <div class="tags-container" id="distractorTags">
              <!-- tags will be dynamically added here -->
            </div>
          </div>


        </form>

        <button type="submit" class="create-question-btn">Create question</button>
        
        <h3 class="sub-heading">Existing questions for prompt word:</h3>

        <table class="translation-table">
          <thead>
            <tr>
              <th>Prompt</th>
              <th>Answer</th>
              <th>Distractors</th>
              <th>Difficulty</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <!-- Rows will go here -->
          </tbody>
        </table>
      </div>
    `;
  }

  async mount() {
    await this.loadLanguages();
    this.populateLanguageDropdown();
    this.setupLanguageSelection();
    this.setupFieldDependencies();
    setupDistractorInput();
    AutocompleteService.setupForComponent(this, "answerWord", "autocompleteDropdown");
  }

  private setupFieldDependencies() {
  const languageSelect = document.getElementById("answerLanguage") as HTMLSelectElement;
  const promptInput = document.querySelector("input[name='promptWord']") as HTMLInputElement;
  const difficultySelect = document.querySelector("select[name='difficulty']") as HTMLSelectElement;
  const answerInput = document.getElementById("answerWord") as HTMLInputElement;
  const distractorInput = document.getElementById("distractorInput") as HTMLInputElement;
  const createBtn = document.querySelector(".create-question-btn") as HTMLButtonElement;

  // Disable everything initially except language selector
  promptInput.disabled = true;
  difficultySelect.disabled = true;
  answerInput.disabled = true;
  distractorInput.disabled = true;
  createBtn.disabled = true;

  // Chain dependencies
  languageSelect.addEventListener("change", () => {
    if (languageSelect.value) {
      promptInput.disabled = false;
    }
  });

  promptInput.addEventListener("input", () => {
    if (promptInput.value.trim()) {
      difficultySelect.disabled = false;
    } else {
      difficultySelect.disabled = true;
      answerInput.disabled = true;
      distractorInput.disabled = true;
      createBtn.disabled = true;
    }
  });

  difficultySelect.addEventListener("change", () => {
    if (difficultySelect.value) {
      answerInput.disabled = false;
    }
  });

  answerInput.addEventListener("input", () => {
    if (answerInput.value.trim()) {
      distractorInput.disabled = false;
    } else {
      distractorInput.disabled = true;
      createBtn.disabled = true;
    }
  });

  distractorInput.addEventListener("input", () => {
    const hasDistractors = distractorInput.value.trim().length > 0;
    createBtn.disabled = !hasDistractors;
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
      // Convert API response format to match your expected format
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
      // Set initial selection if needed
      if (this.selectedLanguageId) {
        select.value = this.selectedLanguageId.toString();
      }

      console.log(this.selectedLanguageId)
      
      // Update variable when selection changes
      select.addEventListener('change', () => {
        this.selectedLanguageId = select.value ? parseInt(select.value) : null;
        console.log('Selected language ID:', this.selectedLanguageId);
        // You could trigger other updates here if needed
      });
    }
  }
}

export class TranslationComponent implements BaseComponent {
  render() {
    return `
      <div class="translation-container">
        <h2 class="section-title">Translation Questions</h2>

        <form class="translation-form">
          <select name="prompt-language" id="promptLanguage">
            <option value="" disabled selected>Prompt language</option>
            <option value="Afrikaans">Afrikaans</option>
            <option value="German">German</option>
            <option value="Italian">Italian</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
          </select>

          <select name="answer-language" id="answerLanguage">
            <option value="" disabled selected>Answer language</option>
            <option value="Afrikaans">Afrikaans</option>
            <option value="German">German</option>
            <option value="Italian">Italian</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
          </select>

          <select name="difficulty">
            <option value="" disabled selected>Difficulty</option>
            <option value="1">1 - Very Easy</option>
            <option value="2">2 - Easy</option>
            <option value="3">3 - Medium</option>
            <option value="4">4 - Hard</option>
          </select>

          <input type="text" placeholder="Prompt word" name="promptWord" />
          <input type="text" placeholder="Answer word" name="answerWord" />
          <div id="distractorInputWrapper">
            <input
              type="text"
              id="distractorInput"
              class="distractor-input"
              placeholder="Enter three distractors"
            />
            <div class="tags-container" id="distractorTags">
              <!-- tags will be dynamically added here -->
            </div>
          </div>


        </form>

        <button type="submit" class="create-question-btn">Create question</button>
        
        <h3 class="sub-heading">Existing questions for prompt word:</h3>

        <table class="translation-table">
          <thead>
            <tr>
              <th>Prompt</th>
              <th>Answer</th>
              <th>Distractors</th>
              <th>Difficulty</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <!-- Rows will go here -->
          </tbody>
        </table>
      </div>
    `;
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


export class AutocompleteService {
  static async setupForComponent(
    component: { selectedLanguageId: number | null },
    inputId: string,
    dropdownId: string
  ) {
    const input = document.getElementById(inputId) as HTMLInputElement;
    const dropdown = document.getElementById(dropdownId) as HTMLDivElement;

    if (!input || !dropdown) return;

    input.addEventListener("input", async () => {
      const searchText = input.value.trim();
      dropdown.innerHTML = '';
      
      if (searchText.length < 2 || !component.selectedLanguageId) return;
      console.log(component.selectedLanguageId)
      try {
        const res = await apiFetch(
          `/api/word?languageId=${component.selectedLanguageId}&wordSearchText=${encodeURIComponent(searchText)}`
        );
        const words = await res;
        console.log(words)

        if (Array.isArray(words)) {
          words.forEach(word => {
            const item = document.createElement('div');
            item.textContent = word.word;
            item.addEventListener('click', () => {
              input.value = word.word;
              dropdown.innerHTML = '';
            });
            dropdown.appendChild(item);
          });
        }
      } catch (err) {
        console.error("Autocomplete fetch failed", err);
      }
    });

    input.addEventListener("blur", () => {
      setTimeout(() => dropdown.innerHTML = '', 100);
    });
  }
}


function setupDistractorInput() {
  const input = document.getElementById("distractorInput") as HTMLInputElement;
  const tagContainer = document.getElementById("distractorTags")!;
  const hiddenInput = document.getElementById("distractorsHidden") as HTMLInputElement;
  let distractors: string[] = [];

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const word = input.value.trim();
      if (!word || distractors.length >= 3 || distractors.includes(word)) return;

      distractors.push(word);
      input.value = "";

      const tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = word;

      const removeBtn = document.createElement("button");
      removeBtn.textContent = "×";
      removeBtn.className = "remove-tag";
      removeBtn.onclick = () => {
        distractors = distractors.filter(w => w !== word);
        tag.remove();
        hiddenInput.value = distractors.join(",");
      };

      tag.appendChild(removeBtn);
      tagContainer.appendChild(tag);
      hiddenInput.value = distractors.join(",");
    }
  });
}



