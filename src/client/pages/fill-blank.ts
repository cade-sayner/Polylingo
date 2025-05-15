import { BasePage, Language } from "../types"
import { FillBlankQuestion } from "../types";
import { auditFillBlank, getFillBlankQuestion } from "../api-client";
import { getSignedInUser, shuffle } from "../utils";
import { colorCrab, seaSponge, imageSrcs, languageOptions } from "../constants";
import { QuestionOptions } from "../components/question-options";
import { Navbar } from "../components/navbar";
import { FillBlankSentence } from "../components/fill-blank-sentence";
import { ResultImageComponent } from "../components/result-image";

export class FillBlankExercisePage implements BasePage {
    currentStreak: number = 0;
    currentLanguageSelection: Language = "Afrikaans";
    currentUserId: number | null = null;
    currentQuestion: FillBlankQuestion | undefined;
    placeholderSentenceSectionElement: HTMLSelectElement | undefined;
    optionsSectionElement: HTMLSelectElement | undefined;
    selectedOption: string | undefined;
    checkButton: HTMLButtonElement | undefined;
    skipButton: HTMLButtonElement | undefined;
    fillBlankFooter: HTMLElement | undefined;
    resultImage: HTMLElement | undefined;

    options = new QuestionOptions();
    navbar = new Navbar(true);
    fillBlankSentence = new FillBlankSentence();
    resultImageComponent = new ResultImageComponent();

    load = async () => {
        this.loadDomElements();

        if(!this.checkButton){
            throw new Error("Required element not found in the dom");
        }

        await this.getQuestion();
        this.setStreak(0);
        this.currentUserId = (await getSignedInUser()).userId;
        let languageSelect = document.querySelector("#language-select") as HTMLSelectElement;

        languageSelect.selectedIndex = languageOptions.indexOf(this.currentLanguageSelection);
        if (languageSelect) {
            languageSelect.addEventListener("change", () => {
                this.currentLanguageSelection = languageSelect.value as Language;
            });
        }

        this.checkButton.disabled = true;

        this.checkButton.addEventListener('click', async (e) => {

            if (this.currentQuestion?.completed) {
                this.handleNext();
                return;
            }
            if (this.currentQuestion && !this.currentQuestion?.completed) {
                await this.handleCheck();
                return;
            }
        })

        this.skipButton?.addEventListener('click', async (e) => {
            if(this.currentQuestion && this.currentUserId){
                await auditFillBlank(this.currentQuestion.fillBlankQuestionsId as number, false, this.currentUserId);
                await this.getQuestion();
            }else{
                throw new Error("Missing state");
            }
        })
    }

    render = () => {
        return [
            this.navbar.render() as HTMLElement,
            (document.querySelector(".fill-blank-template") as HTMLTemplateElement).content.cloneNode(true) as HTMLElement
        ]
    }

    async getQuestion() {
        if (!this.placeholderSentenceSectionElement || !this.optionsSectionElement) {
            throw new Error("Required elements were not loaded in the component's state");
        }
        const character = imageSrcs[Math.floor(Math.random() * imageSrcs.length)];
        const characterImage = document.querySelector(".speaker-image") as HTMLImageElement;
        characterImage.src = `/img/${character}`;
        this.currentQuestion = await getFillBlankQuestion(this.currentLanguageSelection);
        this.placeholderSentenceSectionElement.replaceChildren();
        this.placeholderSentenceSectionElement.append(...this.fillBlankSentence.render(this.currentQuestion.placeholderSentence));
        this.optionsSectionElement.replaceChildren();
        this.optionsSectionElement.append(...this.options.render(shuffle([...this.currentQuestion.distractors, this.currentQuestion.word])));
        this.options.registerOptions(this);
    }

    handleNext() {
        if (!this.currentQuestion || !this.placeholderSentenceSectionElement || !this.optionsSectionElement || !this.checkButton || !this.skipButton || !this.fillBlankFooter || !this.resultImage) {
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
        if (!this.currentQuestion || !this.placeholderSentenceSectionElement || !this.optionsSectionElement || !this.selectedOption || !this.checkButton || !this.skipButton || !this.fillBlankFooter || !this.resultImage) {
            return;
        }
        this.currentQuestion.completed = true;
        this.checkButton.innerText = "Next"
        this.skipButton.style.visibility = "hidden";
        if (this.selectedOption === this.currentQuestion?.word) {
            this.fillBlankFooter.style.backgroundColor = seaSponge;
            this.resultImage.replaceChildren();
            this.resultImage.append(...this.resultImageComponent.render({imageUrl : "correct.png", message: "Well done"}));
            this.resultImage.style.display = "block";
            this.setStreak(this.currentStreak + 1);
            await auditFillBlank(this.currentQuestion.fillBlankQuestionsId, true, this.currentUserId as number);
        } else {
            this.fillBlankFooter.style.backgroundColor = colorCrab;
            this.resultImage.replaceChildren();
            this.resultImage.append(...this.resultImageComponent.render({imageUrl : "incorrect.png", message: `Answer: '${this.currentQuestion.word}'`}));
            this.resultImage.style.display = "block";
            this.setStreak(0);
            await auditFillBlank(this.currentQuestion.fillBlankQuestionsId, true, this.currentUserId as number);
        }
    }

    setStreak = (val: number) => {
        this.currentStreak = val;
        const streakElement = document.querySelector(".streak") as HTMLElement;
        streakElement.innerText = this.currentStreak.toString();
    }

    loadDomElements() {
        this.placeholderSentenceSectionElement = document.querySelector(".placeholder-sentence") as HTMLSelectElement;
        this.optionsSectionElement = document.querySelector(".question-options") as HTMLSelectElement;;
        this.checkButton = document.querySelector("#question-check") as HTMLButtonElement;;
        this.skipButton = document.querySelector("#question-skip") as HTMLButtonElement;
        this.fillBlankFooter = document.querySelector(".question-footer") as HTMLElement;
        this.resultImage = document.querySelector("#question-result-figure") as HTMLElement;
    }
}
