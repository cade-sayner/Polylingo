import { QuestionOptions } from "../components/question-options";
import { Navbar } from "../components/navbar";
import { ResultImageComponent } from "../components/result-image";
import { TranslationComponent } from "../components/translate-component";
import { FillInTheBlankComponent } from "../components/fill-blank-component";
export class InstructorCreatePage {
    constructor() {
        this.currentUserId = null;
        this.fillInTheBlankComponent = new FillInTheBlankComponent();
        this.translationComponent = new TranslationComponent();
        this.currentComponent = 'fill-in-the-blank';
        this.options = new QuestionOptions();
        this.navbar = new Navbar(false);
        this.resultImageComponent = new ResultImageComponent();
        this.load = async () => {
            var _a, _b;
            (_a = document.querySelector("#fill-in-the-blank-btn")) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
                this.currentComponent = 'fill-in-the-blank';
                this.updateContent();
            });
            (_b = document.querySelector("#translation-btn")) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => {
                this.currentComponent = 'translation';
                this.updateContent();
            });
            this.updateContent();
        };
        this.render = () => {
            var _a, _b;
            return `
        ${(_b = (_a = document.querySelector(".instructor-template")) === null || _a === void 0 ? void 0 : _a.innerHTML) !== null && _b !== void 0 ? _b : ""}
        `;
        };
    }
    updateContent() {
        var _a, _b, _c, _d;
        const contentContainer = document.querySelector('.create-question-container');
        if (this.currentComponent === 'fill-in-the-blank') {
            contentContainer.innerHTML = this.fillInTheBlankComponent.render();
            (_b = (_a = this.fillInTheBlankComponent).mount) === null || _b === void 0 ? void 0 : _b.call(_a);
        }
        else if (this.currentComponent === 'translation') {
            contentContainer.innerHTML = this.translationComponent.render();
            (_d = (_c = this.translationComponent).mount) === null || _d === void 0 ? void 0 : _d.call(_c);
        }
    }
}
