import { BasePage, Language, TranslationQuestion } from "../types"
import { auditTranslation, getTranslationQuestion} from "../api-client";
import { getSignedInUser, shuffle } from "../utils";
import { colorCrab, seaSponge, imageSrcs, languageOptions } from "../constants";
import { QuestionOptions } from "../components/question-options";
import { Navbar } from "../components/navbar";
import { ResultImageComponent } from "../components/result-image";

export class TranslationExercisePage implements BasePage {
    currentStreak: number = 0;
    currentLanguageSelection: Language = "Afrikaans";
    currentUserId: number | null = null;
    currentQuestion: TranslationQuestion| undefined;
    optionsSectionElement: HTMLSelectElement | undefined;
    selectedOption: string | undefined;
    checkButton: HTMLButtonElement | undefined;
    skipButton: HTMLButtonElement | undefined;
    promptWordElement : HTMLElement | undefined;
    fillBlankFooter: HTMLElement | undefined;
    resultImage: HTMLElement | undefined;
    swapButton:HTMLButtonElement | undefined;
    toEnglish:boolean = true;
    options = new QuestionOptions();
    navbar = new Navbar(true);
    resultImageComponent = new ResultImageComponent();

    load = async () => {
        this.loadDomElements();

        if(!this.checkButton){
            throw new Error("Required element not found in the dom");
        }

        (this.swapButton as HTMLElement).style.display = "block";
        
        await this.getQuestion();
        this.setStreak(0);
        this.currentUserId = (await getSignedInUser()).userId;
        let languageSelect = document.querySelector("#language-select") as HTMLSelectElement;

        languageSelect.selectedIndex = languageOptions.indexOf(this.currentLanguageSelection);
        if (languageSelect) {
            languageSelect.addEventListener("change", () => {
                this.currentLanguageSelection = languageSelect.value as Language;
                this.getQuestion();
            });
        }

        this.checkButton.disabled = true;


        if(this.swapButton){
            this.swapButton.addEventListener('click', (e)=>{
                this.toEnglish = !this.toEnglish;
                this.getQuestion();
            })
        }

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
                await auditTranslation(this.currentQuestion?.translationQuestionId as number, false, this.currentUserId);
                await this.getQuestion();
            }else{
                throw new Error("Missing state");
            }
        })
    }

    render = () => {
        return [
            this.navbar.render() as HTMLElement,
            (document.querySelector(".translation-template") as HTMLTemplateElement).content.cloneNode(true) as HTMLElement
        ]
    }

    async getQuestion() {
        if (!this.promptWordElement || !this.optionsSectionElement) {
            throw new Error("Required elements were not loaded in the component's state");
        }
        const character = imageSrcs[Math.floor(Math.random() * imageSrcs.length)];
        const characterImage = document.querySelector(".speaker-image") as HTMLImageElement;
        characterImage.src = `/img/${character}`;
        this.currentQuestion = await getTranslationQuestion (this.currentLanguageSelection, this.toEnglish);
        this.promptWordElement.innerText = this.currentQuestion.promptWord;
        this.optionsSectionElement.replaceChildren();
        this.optionsSectionElement.append(...this.options.render(shuffle([...this.currentQuestion.distractors, this.currentQuestion.answerWord])));
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
        if (!this.currentQuestion || !this.promptWordElement || !this.optionsSectionElement || !this.selectedOption || !this.checkButton || !this.skipButton || !this.fillBlankFooter || !this.resultImage) {
            return;
        }
        this.currentQuestion.completed = true;
        this.checkButton.innerText = "Next"
        this.skipButton.style.visibility = "hidden";
        if (this.selectedOption === this.currentQuestion?.answerWord) {
            this.fillBlankFooter.style.backgroundColor = seaSponge;
            this.resultImage.replaceChildren();
            this.resultImage.append(...this.resultImageComponent.render({imageUrl : "correct.png", message: "Well done"}));
            this.resultImage.style.display = "block";
            this.setStreak(this.currentStreak + 1);
            document.querySelector(".selected-option")?.classList.add("correct-option");
            await auditTranslation(this.currentQuestion.translationQuestionId, true, this.currentUserId as number);
        } else {
            this.fillBlankFooter.style.backgroundColor = colorCrab;
            this.resultImage.replaceChildren();
            this.resultImage.append(...this.resultImageComponent.render({imageUrl : "incorrect.png", message: `Answer: '${this.currentQuestion.answerWord}'`}));
            this.resultImage.style.display = "block";
            this.setStreak(0);
            document.querySelector(".selected-option")?.classList.add("wrong-option");
            await auditTranslation(this.currentQuestion.translationQuestionId, true, this.currentUserId as number);
        }
    }

    setStreak = (val: number) => {
        this.currentStreak = val;
        const streakElement = document.querySelector(".streak") as HTMLElement;
        streakElement.innerText = this.currentStreak.toString();
    }

    loadDomElements() {
        this.promptWordElement = document.querySelector(".placeholder-sentence") as HTMLSelectElement;
        this.swapButton = document.querySelector("#swap-language-button") as HTMLButtonElement;
        this.optionsSectionElement = document.querySelector(".question-options") as HTMLSelectElement;;
        this.checkButton = document.querySelector("#question-check") as HTMLButtonElement;;
        this.skipButton = document.querySelector("#question-skip") as HTMLButtonElement;
        this.fillBlankFooter = document.querySelector(".question-footer") as HTMLElement;
        this.resultImage = document.querySelector("#question-result-figure") as HTMLElement;
    }
}
