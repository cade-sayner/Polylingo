import { BaseComponent } from "../types";

export class FillInTheBlankComponent implements BaseComponent {
  render() {
    return `
      <div class="translation-container">
        <h2 class="section-title">Fill in the blank questions</h2>

        <form class="translation-form">
          <select name="answer-language" id="answerLanguage">
            <option value="" disabled selected>Language</option>
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

          <input type="text" placeholder="Missing word" name="answerWord" />
          <input type="text" placeholder="Question Sentence (use ___ for blank)" name="promptWord" />
          
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

  mount() {
    setupDistractorInput()
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



