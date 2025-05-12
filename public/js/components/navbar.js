import { LanguageSelection } from "./language-selection";
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
        var _a, _b, _c;
        console.log(this.includeLanguageSelection);
        console.log("The component is");
        console.log(this.languageSelectionComponent);
        console.log("The thing is" + ((_a = this.languageSelectionComponent) === null || _a === void 0 ? void 0 : _a.render()));
        let rendered = this.includeLanguageSelection ?
            `
        <nav class="login-header">
        ${this.navbar.innerHTML}
        ${(_c = (_b = this.languageSelectionComponent) === null || _b === void 0 ? void 0 : _b.render()) !== null && _c !== void 0 ? _c : ""}
        </nav>
        ` :
            ` 
        <nav class="login-header>
        ${this.navbar.innerHTML}
        </nav>
        `;
        console.log("The rendered nav bar is");
        console.log(rendered);
        return rendered;
    }
}
