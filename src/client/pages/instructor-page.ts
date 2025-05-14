import { BaseComponent, BasePage, Language, TranslationQuestion } from "../types"
import { auditTranslation, getTranslationQuestion} from "../api-client";
import { getSignedInUser, shuffle } from "../utils";
import { colorCrab, seaSponge, imageSrcs, languageOptions } from "../constants";
import { QuestionOptions } from "../components/question-options";
import { Navbar } from "../components/navbar";
import { ResultImageComponent } from "../components/result-image";
import { FillInTheBlankComponent, TranslationComponent } from "../components/instructor-question-types";

export class InstructorCreatePage implements BasePage {
    currentUserId: number | null = null;
    fillInTheBlankComponent: BaseComponent = new FillInTheBlankComponent();
    translationComponent: BaseComponent = new TranslationComponent();

    currentComponent: 'fill-in-the-blank' | 'translation' = 'fill-in-the-blank';

    options = new QuestionOptions();
    navbar = new Navbar(true);
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
        ${this.navbar.render()}
        ${document.querySelector(".instructor-template")?.innerHTML ?? ""}
        `
    }
}
