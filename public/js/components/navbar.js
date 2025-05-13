import { LanguageSelection } from "./language-select";
export class Navbar {
    constructor(includeLanguageSelection) {
        this.includeLanguageSelection = false;
        this.includeLanguageSelection = includeLanguageSelection;
        this.languageSelectionComponent = includeLanguageSelection ? new LanguageSelection() : null;
        if (!document.querySelector("#navbar"))
            throw new Error("Required template is missing from html");
        this.navbar = document.querySelector("#navbar");
    }
    render() {
        var _a, _b;
        let rendered = this.includeLanguageSelection ?
            `
        <nav class="header">
        ${this.navbar.innerHTML}
        ${(_b = (_a = this.languageSelectionComponent) === null || _a === void 0 ? void 0 : _a.render()) !== null && _b !== void 0 ? _b : ""}
        </nav>
        ` :
            ` 
        <nav class="header">
        ${this.navbar.innerHTML}
        </nav>
        `;
        return rendered;
    }
}
