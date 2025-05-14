import { auditTranslation, getTranslationQuestion } from "../api-client";
import { getSignedInUser, shuffle } from "../utils";
import { colorCrab, seaSponge, imageSrcs, languageOptions } from "../constants";
import { QuestionOptions } from "../components/question-options";
import { Navbar } from "../components/navbar";
import { ResultImageComponent } from "../components/result-image";
export class TranslationExercisePage {
    constructor() {
        this.currentStreak = 0;
        this.currentLanguageSelection = "Afrikaans";
        this.currentUserId = null;
        this.options = new QuestionOptions();
        this.navbar = new Navbar(true);
        this.resultImageComponent = new ResultImageComponent();
        this.load = async () => {
            var _a;
            this.loadDomElements();
            if (!this.checkButton) {
                throw new Error("Required element not found in the dom");
            }
            await this.getQuestion();
            this.setStreak(0);
            this.currentUserId = (await getSignedInUser()).userId;
            let languageSelect = document.querySelector("#language-select");
            languageSelect.selectedIndex = languageOptions.indexOf(this.currentLanguageSelection);
            if (languageSelect) {
                languageSelect.addEventListener("change", () => {
                    this.currentLanguageSelection = languageSelect.value;
                });
            }
            this.checkButton.disabled = true;
            this.checkButton.addEventListener('click', async (e) => {
                var _a, _b;
                if ((_a = this.currentQuestion) === null || _a === void 0 ? void 0 : _a.completed) {
                    this.handleNext();
                    return;
                }
                if (this.currentQuestion && !((_b = this.currentQuestion) === null || _b === void 0 ? void 0 : _b.completed)) {
                    await this.handleCheck();
                    return;
                }
            });
            (_a = this.skipButton) === null || _a === void 0 ? void 0 : _a.addEventListener('click', async (e) => {
                await this.getQuestion();
            });
        };
        this.render = () => {
            var _a, _b;
            return `
        ${this.navbar.render()}
        ${(_b = (_a = document.querySelector(".translation-template")) === null || _a === void 0 ? void 0 : _a.innerHTML) !== null && _b !== void 0 ? _b : ""}
        `;
        };
        this.setStreak = (val) => {
            this.currentStreak = val;
            const streakElement = document.querySelector(".streak");
            streakElement.innerText = this.currentStreak.toString();
        };
    }
    async getQuestion() {
        if (!this.promptWordElement || !this.optionsSectionElement) {
            throw new Error("Required elements were not loaded in the component's state");
        }
        const character = imageSrcs[Math.floor(Math.random() * imageSrcs.length)];
        const characterImage = document.querySelector(".speaker-image");
        characterImage.src = `/img/${character}`;
        this.currentQuestion = await getTranslationQuestion(this.currentLanguageSelection);
        this.promptWordElement.innerText = `${this.currentQuestion.promptWord} . . .`;
        this.optionsSectionElement.innerHTML = this.options.render(shuffle([...this.currentQuestion.distractors, this.currentQuestion.answerWord]));
        this.options.registerOptions(this, false);
    }
    handleNext() {
        if (!this.currentQuestion || !this.promptWordElement || !this.optionsSectionElement || !this.checkButton || !this.skipButton || !this.fillBlankFooter || !this.resultImage) {
            throw new Error("Required elements not loaded in the component's state");
        }
        this.getQuestion();
        this.resultImage.innerText = "";
        this.resultImage.style.display = "none";
        this.checkButton.innerText = "Check";
        this.checkButton.disabled = true;
        this.skipButton.style.visibility = "visible";
        this.fillBlankFooter.style.backgroundColor = "white";
    }
    async handleCheck() {
        var _a, _b, _c;
        if (!this.currentQuestion || !this.promptWordElement || !this.optionsSectionElement || !this.selectedOption || !this.checkButton || !this.skipButton || !this.fillBlankFooter || !this.resultImage) {
            return;
        }
        this.currentQuestion.completed = true;
        this.checkButton.innerText = "Next";
        this.skipButton.style.visibility = "hidden";
        if (this.selectedOption === ((_a = this.currentQuestion) === null || _a === void 0 ? void 0 : _a.answerWord)) {
            this.fillBlankFooter.style.backgroundColor = seaSponge;
            this.resultImage.innerHTML = this.resultImageComponent.render({ imageUrl: "correct.png", message: "Well done" });
            this.resultImage.style.display = "block";
            this.setStreak(this.currentStreak + 1);
            (_b = document.querySelector(".selected-option")) === null || _b === void 0 ? void 0 : _b.classList.add("correct-option");
            await auditTranslation(this.currentQuestion.translationQuestionId, true, this.currentUserId);
        }
        else {
            this.fillBlankFooter.style.backgroundColor = colorCrab;
            this.resultImage.innerHTML = this.resultImageComponent.render({ imageUrl: "incorrect.png", message: `Answer: '${this.currentQuestion.answerWord}'` });
            this.resultImage.style.display = "block";
            this.setStreak(0);
            (_c = document.querySelector(".selected-option")) === null || _c === void 0 ? void 0 : _c.classList.add("wrong-option");
            await auditTranslation(this.currentQuestion.translationQuestionId, true, this.currentUserId);
        }
    }
    loadDomElements() {
        this.promptWordElement = document.querySelector(".placeholder-sentence");
        this.optionsSectionElement = document.querySelector(".question-options");
        ;
        this.checkButton = document.querySelector("#question-check");
        ;
        this.skipButton = document.querySelector("#question-skip");
        this.fillBlankFooter = document.querySelector(".question-footer");
        this.resultImage = document.querySelector("#question-result-figure");
    }
}
