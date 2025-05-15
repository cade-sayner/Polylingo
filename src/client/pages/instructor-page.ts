import { BaseComponent, BasePage, Language, TranslationQuestion } from "../types"
import { colorCrab, seaSponge, imageSrcs, languageOptions } from "../constants";
import { QuestionOptions } from "../components/question-options";
import { Navbar } from "../components/navbar";
import { ResultImageComponent } from "../components/result-image";
import { TranslationComponent } from "../components/translate-component";
import { FillInTheBlankComponent } from "../components/fill-blank-component";
import { getExistingFillBlankQuestions, getExistingTranslationQuestions, deleteFillBlankQuestion, deleteTranslationQuestion } from "../api-client";

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

    deleteTranslation(id : number, word: string, answerWordId: number) {
        const confirmation = confirm(`Deleting question for word: ${word}. Are you sure you want to continue?`);
        if (confirmation) 
        {
            deleteTranslationQuestion(id);
            this.loadExistingQuestions(answerWordId)
        }
    }

    deleteFillBlank(id : number, word: string, answerWordId: number) {
        const confirmation = confirm(`Deleting question for word: ${word}. Are you sure you want to continue?`);
        if (confirmation) 
        {
            deleteFillBlankQuestion(id);
            this.loadExistingQuestions(answerWordId)
        }
    }

    async loadExistingQuestions(answerWordId : number = 20) {
        // const languageElement = document.querySelector('answerLanguage') as HTMLSelectElement;
        // const language = languageElement?.value;
        // const wordElement = (document.querySelector('answerWord') as HTMLInputElement);
        // const word = wordElement?.value;

        if (this.currentComponent === 'fill-in-the-blank')
        {
            const existingQuestions = await getExistingFillBlankQuestions(answerWordId);
            const tbody = document.getElementById('existing-fill-blank-body');
            if (tbody == null || existingQuestions == null)
                return
            if (existingQuestions.length != 0)
            {
                tbody.innerHTML = '';
                existingQuestions.forEach(q => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                    <td>${q.placeholderSentence}</td>
                    <td>${q.word}</td>
                    <td>${q.distractors.join(', ')}</td>
                    <td>${q.difficultyScore}</td>
                    <td>
                        <button class="delete-btn">Delete</button>
                    </td>
                    `;
                    tbody.appendChild(tr);
                    const deleteBtn = tr.querySelector('.delete-btn') as HTMLButtonElement;
                    deleteBtn.addEventListener('click', () => this.deleteFillBlank(q.fillBlankQuestionsId, q.word, answerWordId));
                });
            }
            else
            {
                tbody.innerHTML = '';
                const tr = document.createElement('tr');
                tr.innerHTML = `
                <td>No questions found for answer word.</td>
                `;
                tbody.appendChild(tr);
            }
        }
        else if (this.currentComponent === 'translation')
        {
            const existingQuestions = await getExistingTranslationQuestions(answerWordId);
            const tbody = document.getElementById('existing-translations-body');
            if (tbody == null || existingQuestions == null)
                return
            if (existingQuestions.length != 0)
            {
                tbody.innerHTML = '';
                existingQuestions.forEach(q => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                    <td>${q.promptWord}</td>
                    <td>${q.word}</td>
                    <td>${q.distractors.join(', ')}</td>
                    <td>${q.difficultyScore}</td>
                    <td>
                        <button class="delete-btn">Delete</button>
                    </td>
                    `;
                    tbody.appendChild(tr);
                    const deleteBtn = tr.querySelector('.delete-btn') as HTMLButtonElement;
                    deleteBtn.addEventListener('click', () => this.deleteTranslation(q.translationQuestionId, q.answerWord, answerWordId));
                });
            }
            else
            {
                tbody.innerHTML = '';
                const tr = document.createElement('tr');
                tr.innerHTML = `
                <td>No questions found for answer word.</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                `;
                tbody.appendChild(tr);
            }
            
        }
    }

    render = () => {
        return `
        ${this.navbar.render()}
        ${document.querySelector(".instructor-template")?.innerHTML ?? ""}
        `
    }
}
