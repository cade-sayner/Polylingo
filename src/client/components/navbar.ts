import { BaseComponent } from "../types";
import { LanguageSelection } from "./language-select";

export class Navbar implements BaseComponent{
    includeLanguageSelection : boolean = false;
    navbar : HTMLElement;
    
    languageSelectionComponent : LanguageSelection | null;

    constructor(includeLanguageSelection : boolean){
        this.includeLanguageSelection = includeLanguageSelection
        this.languageSelectionComponent = includeLanguageSelection ? new LanguageSelection() : null;
        if(!document.querySelector("#navbar")) throw new Error("Required template is missing from html");
        this.navbar = document.querySelector("#navbar") as HTMLElement;
    }
    render(){
        console.log(this.includeLanguageSelection);
        console.log("The component is");
        console.log(this.languageSelectionComponent)
        console.log("The thing is" + this.languageSelectionComponent?.render());
        let rendered = this.includeLanguageSelection ?
        `
        <nav class="login-header">
        ${this.navbar.innerHTML}
        ${this.languageSelectionComponent?.render() ?? ""}
        </nav>
        ` :
        ` 
        <nav class="login-header>
        ${this.navbar.innerHTML}
        </nav>
        `
        console.log("The rendered nav bar is");
        console.log(rendered);
        return rendered;
    }
}