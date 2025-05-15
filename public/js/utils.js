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
    static async setupForComponent(component, inputId, dropdownId, onSelect) {
        const input = document.getElementById(inputId);
        const dropdown = document.getElementById(dropdownId);
        if (!input || !dropdown)
            return;
        input.addEventListener("input", async () => {
            const searchText = input.value.trim();
            dropdown.innerHTML = '';
            if (searchText.length < 2 || !component.selectedLanguageId)
                return;
            try {
                const res = await apiFetch(`/api/word?languageId=${component.selectedLanguageId}&wordSearchText=${encodeURIComponent(searchText)}`);
                const words = await res;
                console.log(words);
                if (Array.isArray(words)) {
                    words.forEach((word) => {
                        const item = document.createElement('div');
                        item.textContent = word.word;
                        item.classList.add("autocomplete-item");
                        item.addEventListener('click', () => {
                            input.value = word.word;
                            dropdown.innerHTML = '';
                            if (onSelect) {
                                onSelect({ id: word.wordId, word: word.word });
                            }
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
