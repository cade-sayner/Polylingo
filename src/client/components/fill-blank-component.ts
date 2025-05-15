import { apiFetch } from "../api-client";
import { BaseComponent } from "../types";
import { setupDistractorInput, AutocompleteService } from "../utils";

export class FillInTheBlankComponent implements BaseComponent {
  private languages: {language_id: number, language_name: string}[] = [];
  public selectedLanguageId: number | null = null;


  render() {
    return document.querySelector("#fill-blank-component")?.innerHTML ?? "";
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
    const answerInput = document.getElementById("answerWord") as HTMLInputElement;
    const distractorInput = document.getElementById("distractorInput") as HTMLInputElement;
    const createBtn = document.querySelector(".create-question-btn") as HTMLButtonElement;
 
    answerInput.disabled = true;
    createBtn.disabled = true;

    // Chain dependencies
    languageSelect.addEventListener("change", () => {
      if (languageSelect.value) {
        answerInput.disabled = false;
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
}