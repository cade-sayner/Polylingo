import { apiFetch } from "./api-client";
export async function getSignedInUser() {
    return await apiFetch("/api/users");
}
export function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
export function flipAnimation(start, end) {
    // set the transform of end element to be that of the start element
    end.innerText = start.innerText;
    const { left: endCoordX, top: endCoordY } = end.getBoundingClientRect();
    const { left: startCoordX, top: startCoordY } = start.getBoundingClientRect();
    const deltaX = startCoordX - endCoordX;
    const deltaY = startCoordY - endCoordY;
    end.style.transform = `translate(${deltaX}px,${deltaY}px)`;
    end.style.visibility = "visible";
    setTimeout(() => {
        end.style.transitionDuration = "0.3s";
        end.style.transform = `translate(0px, 0px)`;
    }, 100);
    setTimeout(() => {
        end.style.transitionDuration = "0s";
    }, 400);
}
export function setupDistractorInput() {
    const input = document.getElementById("distractorInput");
    const tagContainer = document.getElementById("distractorTags");
    const hiddenInput = document.getElementById("distractorsHidden");
    let distractors = [];
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const word = input.value.trim();
            if (!word || distractors.length >= 3 || distractors.includes(word))
                return;
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
export class AutocompleteService {
    static async setupForComponent(
    // Accept a function that returns the current languageId, or null if none selected
    getSelectedLanguageId, inputId, dropdownId, onSelect) {
        const input = document.getElementById(inputId);
        const dropdown = document.getElementById(dropdownId);
        if (!input || !dropdown)
            return;
        function selectItem(word) {
            input.value = word.word;
            dropdown.innerHTML = '';
            if (onSelect) {
                onSelect({ id: word.wordId, word: word.word });
            }
        }
        input.addEventListener("input", async () => {
            const searchText = input.value.trim();
            dropdown.innerHTML = '';
            const selectedLanguageId = getSelectedLanguageId();
            if (searchText.length < 2 || !selectedLanguageId)
                return;
            try {
                const res = await apiFetch(`/api/word?languageId=${selectedLanguageId}&wordSearchText=${encodeURIComponent(searchText)}`);
                const words = await res;
                console.log(words);
                if (Array.isArray(words)) {
                    words.forEach((word) => {
                        const item = document.createElement('div');
                        item.textContent = word.word;
                        item.classList.add("autocomplete-item");
                        item.addEventListener('mousedown', (e) => {
                            e.preventDefault(); // Prevent input blur before click
                            selectItem(word);
                        });
                        item.addEventListener('click', (e) => {
                            e.preventDefault(); // Prevent any default action
                            selectItem(word);
                        });
                        dropdown.appendChild(item);
                    });
                }
            }
            catch (err) {
                console.error("Autocomplete fetch failed", err);
            }
        });
        input.addEventListener("blur", () => {
            setTimeout(() => dropdown.innerHTML = '', 100);
        });
    }
}
export async function getExistingTranslationQuestions(answerWordId) {
    let response = await apiFetch(`/api/translationquestions?answerWordId=${answerWordId}`);
    return response;
}
export async function getExistingFillBlankQuestions(answerWordId) {
    let response = await apiFetch(`/api/fill_blank?answerWordId=${answerWordId}`);
    return response;
}
export async function deleteFillBlankQuestion(questionId) {
    await apiFetch(`/api/fill_blank/${questionId}`, {
        method: "Delete"
    });
}
export function getElement(selector) {
    const el = document.querySelector(selector.startsWith("#") || selector.startsWith(".") ? selector : `#${selector}`);
    if (!el)
        throw new Error(`Element not found: ${selector}`);
    return el;
}
export function populateAnswerWord(word, id, element, elementId, buttonElement) {
    const input = getElement(element);
    const hiddenInput = getElement(elementId);
    const clearBtn = getElement(buttonElement);
    input.value = word;
    hiddenInput.value = id.toString();
    input.readOnly = true;
    clearBtn.style.display = "inline-block";
}
export async function deleteTranslationQuestion(questionId) {
    await apiFetch(`/api/translationquestions/${questionId}`, {
        method: "Delete"
    });
}
export function populateLanguageDropdown(selectId, languages) {
    const select = document.getElementById(selectId);
    if (select) {
        select.innerHTML = `
      <option value="" disabled selected>Language</option>
      ${languages
            .map((lang) => `<option value="${lang.language_id}">${lang.language_name}</option>`)
            .join("")}
    `;
    }
}
