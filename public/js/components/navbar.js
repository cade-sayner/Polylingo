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
        var _a;
        const navBar = document.createElement("nav");
        navBar.classList.add("header");
        navBar.appendChild(this.navbar.content.cloneNode(true));
        if (this.includeLanguageSelection) {
            navBar.appendChild((_a = this.languageSelectionComponent) === null || _a === void 0 ? void 0 : _a.render());
        }
        return navBar;
    }
}
