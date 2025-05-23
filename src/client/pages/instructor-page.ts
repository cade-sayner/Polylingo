import { BaseComponent, BaseInstructorComponent, BaseInstructorPage, BasePage, Language, TranslationQuestion } from "../types"
import { colorCrab, seaSponge, imageSrcs, languageOptions } from "../constants";
import { QuestionOptions } from "../components/question-options";
import { Navbar } from "../components/navbar";
import { ResultImageComponent } from "../components/result-image";
import { TranslationComponent } from "../components/translate-component";
import { FillInTheBlankComponent } from "../components/fill-blank-component";
import { getExistingFillBlankQuestions, getExistingTranslationQuestions, deleteFillBlankQuestion, deleteTranslationQuestion } from "../api-client";

export class InstructorCreatePage implements BaseInstructorPage {
    currentUserId: number | null = null;
    fillInTheBlankComponent: BaseInstructorComponent = new FillInTheBlankComponent();
    translationComponent: BaseInstructorComponent = new TranslationComponent();

    currentComponent: 'fill-in-the-blank' | 'translation' = 'fill-in-the-blank';

    options = new QuestionOptions();
    navbar = new Navbar(false);
    resultImageComponent = new ResultImageComponent();

    load = async () => {
        
        document.querySelector("#fill-in-the-blank-btn")?.addEventListener('click', () => {
        this.currentComponent = 'fill-in-the-blank';
        this.updateContent();
        });

        document.querySelector("#translation-btn")?.addEventListener('click', () => {
        this.currentComponent = 'translation';
        this.updateContent();
        });

        this.updateContent();
    }

    updateContent() {
        const contentContainer = document.querySelector('.create-question-container') as HTMLElement;

        if (this.currentComponent === 'fill-in-the-blank') {
            contentContainer.innerHTML = this.fillInTheBlankComponent.render();
            this.fillInTheBlankComponent.mount?.()
        } else if (this.currentComponent === 'translation') {
            contentContainer.innerHTML = this.translationComponent.render();
            this.translationComponent.mount?.()
        }
    }

    render = () => {
        return `
        ${document.querySelector(".instructor-template")?.innerHTML ?? ""}
        `
    }
}
